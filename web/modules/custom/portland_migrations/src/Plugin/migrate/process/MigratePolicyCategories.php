<?php

namespace Drupal\portland_migrations\Plugin\migrate\process;

use Drupal\migrate\MigrateException;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\MigrateSkipProcessException;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Drupal\taxonomy\Entity\Term;

/**
 * This plugin migrates the 3rd level categories included in the policies.csv datafile,
 * links them to their parent category based on the 2nd level category code in the policy number,
 * and stores them as an entity reference in field_policy_category (stores the tid). 
 *
 * @MigrateProcessPlugin(
 *   id = "migrate_policy_categories"
 * )
 */
class MigratePolicyCategories extends ProcessPluginBase {
  /**
   * Migrates the policy category. Creates category and sets parent if it doesn't exist. 
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {

    // $value is an array
    // 0 - 3rd level category name. E.g. "Park Uses"
    // 1 - Policy Number, from which to parse the 2nd level category abbreviations. E.g. "ARB-PRK-1.14"
    $l3_category = $value[0];
    $policy_number = $value[1];
    // if policy number is empty, this may be one of the overview documents; skip assigning a category
    if (!$policy_number) {
      $message = "No policy number provided; this must be an overview page (" . $l3_category . ").";
      \Drupal::logger('portland_migrations')->notice($message);
      throw new MigrateSkipProcessException();      
    }
    $policy_number_array = preg_split("/-/", $policy_number);
    // there are a few isolated cases where the policy number uses a space instead of hyphen,
    // try to capture and correct them.
    if (count($policy_number_array) < 3) {
      $policy_number = preg_replace("/ /", "-", $policy_number);
      $policy_number_array = preg_split("/-/", $policy_number);
    }
    $l2_category_code = $policy_number_array[1];
    $vocabulary = "policy_category";

    // Load L2 category, this will be created by policies_category migration
    $term_storage = \Drupal::entityManager()->getStorage('taxonomy_term');
    $properties = [
      'vid' => "policy_category",
      'field_category_abbreviation' => $l2_category_code,
    ];
    $l2_category = $term_storage->loadByProperties($properties);

    if(count($l2_category) == 0) {
      echo ($l2_category_code . ' is not found as a Level 2 category. Please check policy_category taxonomy.');
      exit();
    }

    $l3_category_terms = $term_storage->loadChildren(reset($l2_category)->id());
    $l3_term = null;
    foreach($l3_category_terms as $l3_category_term) {
      if($l3_category == $l3_category_term->getName()){
        $l3_term = $l3_category_term;
        break;
      }
    }
    // Create the L3 category term if not found
    if( $l3_term == null ) {
      $l3_term = Term::create([
        'name' => $l3_category, 
        'vid'  => $vocabulary,
      ]);
      $l3_term->parent = reset($l2_category)->id();
      $l3_term->save();
    }

    // return id of the L3 category
    return $l3_term->id();
  }
}