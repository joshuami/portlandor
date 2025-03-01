<?php

namespace Drupal\portland_location_picker\Validate;

use Drupal\Core\Field\FieldException;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form API callback. Validate element value.
 */
class GeolocationValidationConstraint {

  /**
   * Validates given element.
   *
   * @param array              $element      The form element to process.
   * @param FormStateInterface $formState    The form state.
   * @param array              $form The complete form structure.
   */
  public static function validate(array &$element, FormStateInterface $formState, array &$form) {
    $value = $formState->getValue('report_location');
    $loctype = $value['location_type'];

    // if $value is null, that means the location picker widget wasn't exposed or used in the form.
    // we can ignore validation.
    if (!isset($value)) {
      return false;
    }

    // we need to validate that the user has selected a location and that the
    // lat/lon values have been provided. We don't always need an address, but lat/lon
    // are always required if a location_type has been selected and the report_location 
    // field is present.
    $lat = $value['location_lat'];
    $lon = $value['location_lon'];
    $invalid = $loctype && $loctype != "private" && (!$lat || !$lon);

    if ($invalid) {
      // location is required but not provided
      $formState->setError($element, t('You must select a location for this report before submitting.'));
    }
  }
}

