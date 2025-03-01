<?php

namespace Drupal\media_embed_field\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a MediaEmbedProvider item annotation object.
 *
 * @Annotation
 */
class MediaEmbedProvider extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The title of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $title;

}
