<?php

/**
 * Registriert Meta-Felder für Teammitglieder.
 */

if (! defined('ABSPATH')) {
    exit;
}

function ud_team_cpt_register_meta() {
    // team_email 
    register_post_meta(
        'ud_team',
        'team_email',
        [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => [
                'schema' => [
                    'type' => 'string',
                ],
            ],
            'sanitize_callback' => 'sanitize_email',
            'auth_callback'     => function ($allowed, $meta_key, $post_id) {
                return current_user_can('edit_post', $post_id);
            },
        ]
    );

    // team_email_label
    register_post_meta(
        'ud_team',
        'team_email_label',
        [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => [
                'schema' => [
                    'type' => 'string',
                ],
            ],
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback'     => function ($allowed, $meta_key, $post_id) {
                return current_user_can('edit_post', $post_id);
            },
        ]
    );

    // team_is_leitung
    register_post_meta(
        'ud_team',
        'team_is_leitung',
        [
            'type'              => 'boolean',
            'single'            => true,
            'show_in_rest'      => [
                'schema' => [
                    'type' => 'boolean',
                ],
            ],
            'sanitize_callback' => 'rest_sanitize_boolean',
            'auth_callback'     => function ($allowed, $meta_key, $post_id) {
                return current_user_can('edit_post', $post_id);
            },
        ]
    );
}
add_action('init', 'ud_team_cpt_register_meta');
