<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @package Galleryberg
 */

namespace Galleryberg\Admin;

/**
 * Manage Galleryberg Admin
 */
class Galleryberg_Admin {
	/**
	 * The ID of this plugin.
	 *
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The PATH of this plugin.
	 *
	 * @access   private
	 * @var      string $plugin_path The PATH of this plugin.
	 */
	private $plugin_path;

	/**
	 * The URL of this plugin.
	 *
	 * @access   private
	 * @var      string $plugin_url The URL of this plugin.
	 */
	private $plugin_url;

	/**
	 * Initialize the class and set its properties.
	 */
	public function __construct() {
		$this->plugin_name = 'galleryberg-gallery-block';
		$this->version     = GALLERYBERG_BLOCKS_VERSION;
		$this->plugin_path = GALLERYBERG_BLOCKS_DIR_PATH;
		$this->plugin_url  = GALLERYBERG_BLOCKS_PLUGIN_URL;

		// Initialize version control manager.
		\Galleryberg\Version_Control::init();

		add_action( 'admin_menu', array( $this, 'register_admin_menus' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_script' ) );
	}

	/**
	 * Add data for admin settings menu frontend.
	 *
	 * @param array $data frontend data.
	 *
	 * @return array filtered frontend data
	 */
	public function add_settings_menu_data( $data ) {
		$data['assets'] = array(
			'logo' => trailingslashit( $this->plugin_url ) . 'includes/Admin/images/logos/menu-icon-colored.svg',
		);

		global $gp_fs;
		if ( isset( $gp_fs ) && function_exists( 'gp_fs' ) ) {
			$data['misc'] = array(
				'pro_status' => gp_fs()->is_premium() && gp_fs()->has_active_valid_license(),
			);
		} else {
			$data['misc'] = array(
				'pro_status' => false,
			);
		}

		$data['welcome'] = array(
			'title'   => __( 'Welcome to Galleryberg!', 'galleryberg-gallery-block' ),
			'content' => __( 'Elevate Your Content with Beautiful Galleries - The Ultimate WordPress Block Editor Plugin for Effortless Gallery Creation!', 'galleryberg-gallery-block' ),
		);

		$data['video'] = array(
			'title'     => __( 'Getting Started with Galleryberg', 'galleryberg-gallery-block' ),
			'video_id'  => 'XbkADuIWemA',
			'thumbnail' => 'https://img.youtube.com/vi/XbkADuIWemA/maxresdefault.jpg',
		);

		$data['documentation'] = array(
			'title'   => __( 'Documentation', 'galleryberg-gallery-block' ),
			'content' => __( 'Elevate your space with Galleryberg: a sleek, modern gallery block for style and functionality. Crafted for timeless elegance and versatility.', 'galleryberg-gallery-block' ),
			'url'     => 'https://galleryberg.com/docs/',
			'button'  => __( 'Visit Documents', 'galleryberg-gallery-block' ),
		);

		$data['support'] = array(
			'title'   => __( 'Support', 'galleryberg-gallery-block' ),
			'content' => __( 'Visit our Galleryberg Support Page for quick solutions and assistance. We\'re here to ensure your Galleryberg experience is seamless and satisfying.', 'galleryberg-gallery-block' ),
			'url'     => 'https://galleryberg.com/support/',
			'button'  => __( 'Support Forum', 'galleryberg-gallery-block' ),
		);

		$data['upgrade'] = array(
			'title'   => __( 'Upgrade to Galleryberg PRO!', 'galleryberg-gallery-block' ),
			'content' => __( 'Elevate Your Content with Beautiful Galleries - The Ultimate WordPress Block Editor Plugin for Effortless Gallery Creation!', 'galleryberg-gallery-block' ),
			'url'     => 'https://galleryberg.com/pricing/',
			'button'  => __( 'GET GALLERYBERG PRO', 'galleryberg-gallery-block' ),
		);

		$data['features'] = array(
			'title'       => __( 'Gallery Features', 'galleryberg-gallery-block' ),
			'description' => __( 'Explore the powerful features available in Galleryberg Gallery Block.', 'galleryberg-gallery-block' ),
			'list'        => array(
				array(
					'title'       => __( 'Column Layouts', 'galleryberg-gallery-block' ),
					'description' => __( 'Display your images in flexible column layouts with customizable gaps and spacing.', 'galleryberg-gallery-block' ),
					'is_pro'      => false,
				),
				array(
					'title'       => __( 'Image Cropping', 'galleryberg-gallery-block' ),
					'description' => __( 'Choose from multiple aspect ratios to crop your images uniformly.', 'galleryberg-gallery-block' ),
					'is_pro'      => false,
				),
				array(
					'title'       => __( 'Lightbox Integration', 'galleryberg-gallery-block' ),
					'description' => __( 'Built-in lightbox functionality for viewing images in full size.', 'galleryberg-gallery-block' ),
					'is_pro'      => false,
				),
				array(
					'title'       => __( 'Mosaic Layout', 'galleryberg-gallery-block' ),
					'description' => __( 'Create stunning mosaic galleries with varying image sizes for a modern, dynamic look.', 'galleryberg-gallery-block' ),
					'is_pro'      => true,
				),
				array(
					'title'       => __( 'Manual Span Controls', 'galleryberg-gallery-block' ),
					'description' => __( 'Control individual image sizes with manual span controls (1-5) for horizontal and vertical dimensions.', 'galleryberg-gallery-block' ),
					'is_pro'      => true,
				),
			),
			'cta'         => array(
				'title'   => __( 'Ready to unlock all features?', 'galleryberg-gallery-block' ),
				'content' => __( 'Upgrade to Galleryberg PRO and get access to mosaic layouts, manual span controls, and future premium features.', 'galleryberg-gallery-block' ),
				'url'     => 'https://galleryberg.com/pricing/',
				'button'  => __( 'Upgrade to PRO', 'galleryberg-gallery-block' ),
			),
		);

		return $data;
	}

	/**
	 * Enqueue admin scripts.
	 */
	public function enqueue_admin_script() {
		// Only enqueue on our settings page
		$screen = get_current_screen();
		if ( ! $screen || strpos( $screen->id, 'galleryberg-settings' ) === false ) {
			return;
		}

		wp_enqueue_script(
			'galleryberg-admin-script',
			$this->plugin_url . 'includes/Admin/assets/galleryberg-admin.build.js',
			array(
				'lodash',
				'react',
				'wp-block-editor',
				'wp-blocks',
				'wp-components',
				'wp-data',
				'wp-element',
				'wp-i18n',
				'wp-primitives',
			),
			$this->version,
			true
		);

		$frontend_script_data = apply_filters( 'galleryberg/filter/admin_settings_menu_data', array() );
		$frontend_script_data = $this->add_settings_menu_data( $frontend_script_data );

		wp_localize_script( 'galleryberg-admin-script', 'gallerybergAdminMenuData', $frontend_script_data );

		wp_enqueue_style(
			'galleryberg-admin-style',
			$this->plugin_url . 'includes/Admin/assets/galleryberg-admin-style.css',
			array(),
			$this->version,
			'all'
		);
	}

	/**
	 * Set template for main setting page
	 *
	 * @return void
	 */
	public function main_menu_template_cb() {
		?>
		<div id="galleryberg-admin-menu"></div>
		<?php
	}

	/**
	 * Register Setting Pages for the admin area.
	 */
	public function register_admin_menus() {
		add_menu_page(
			__( 'Galleryberg Settings', 'galleryberg-gallery-block' ),
			__( 'Galleryberg', 'galleryberg-gallery-block' ),
			'manage_options',
			'galleryberg-settings',
			array( $this, 'main_menu_template_cb' ),
			plugin_dir_url( __FILE__ ) . 'images/logos/menu-icon.svg'
		);
	}
}
