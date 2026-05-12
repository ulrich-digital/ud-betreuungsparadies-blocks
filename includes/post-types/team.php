<?php
if (! defined('ABSPATH')) exit;

function ud_team_cpt_register_post_type() {
    $labels = [
        'name'                  => _x('Team', 'Post type general name', 'ud-team-cpt-ud'),
        'singular_name'         => _x('Teammitglied', 'Post type singular name', 'ud-team-cpt-ud'),
        'menu_name'             => _x('Team', 'Admin Menu text', 'ud-team-cpt-ud'),
        'name_admin_bar'        => _x('Teammitglied', 'Add New on Toolbar', 'ud-team-cpt-ud'),
        'add_new'               => __('Neu hinzufügen', 'ud-team-cpt-ud'),
        'add_new_item'          => __('Neues Teammitglied hinzufügen', 'ud-team-cpt-ud'),
        'new_item'              => __('Neues Teammitglied', 'ud-team-cpt-ud'),
        'edit_item'             => __('Teammitglied bearbeiten', 'ud-team-cpt-ud'),
        'view_item'             => __('Teammitglied ansehen', 'ud-team-cpt-ud'),
        'all_items'             => __('Alle Teammitglieder', 'ud-team-cpt-ud'),
        'search_items'          => __('Teammitglieder suchen', 'ud-team-cpt-ud'),
        'not_found'             => __('Keine Teammitglieder gefunden.', 'ud-team-cpt-ud'),
        'not_found_in_trash'    => __('Keine Teammitglieder im Papierkorb gefunden.', 'ud-team-cpt-ud'),
        'featured_image'        => __('Portraitbild', 'ud-team-cpt-ud'),
        'set_featured_image'    => __('Portraitbild festlegen', 'ud-team-cpt-ud'),
        'remove_featured_image' => __('Portraitbild entfernen', 'ud-team-cpt-ud'),
        'use_featured_image'    => __('Als Portraitbild verwenden', 'ud-team-cpt-ud'),
    ];

    $args = [
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true,
        'query_var'          => true,
        'rewrite'            => ['slug' => 'team'],
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 20,
        'menu_icon'          => 'dashicons-groups',
        'supports'           => ['title', 'editor', 'custom-fields', 'page-attributes', 'revisions'],

        'template' => [
            [
                'ud-betreuungsparadies/team-hero',
                [
                    'gradient' => 'linear-gradient(180deg, #F2D3E3 0%, #EBBCD3 100%)',
                    'lock'     => [
                        'remove' => true,
                        'move'   => true,
                    ],
                ],
                [
                    [
                        'core/image',
                        [
                            'lock' => [
                                'remove' => true,
                                'move'   => true,
                            ],
                        ],
                    ],
                    [
                        'ud-betreuungsparadies/content-card',
                        [
                            'gradient'  => 'linear-gradient(180deg, #F2D3E3 0%, #EBBCD3 100%)',
                            'className' => 'is-overlay',
                            'lock'      => [
                                'remove' => true,
                                'move'   => true,
                            ],
                        ],
                        [
                            [
                                'core/paragraph',
                                [
                                    'placeholder' => 'Kurzes Zitat oder persönlicher Leitsatz…',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'ud-betreuungsparadies/card-grid',
                [
                    'cardWidth'     => '280px',
                    'cardAlignment' => 'start',
                    'lock'          => [
                        'remove' => true,
                        'move'   => true,
                    ],
                ],
                [
                    [
                        'ud-betreuungsparadies/content-card',
                        [
                            'gradient' => 'linear-gradient(180deg, #B8E6DE 0%, #98D9CD 100%)',
                            'lock'     => [
                                'remove' => true,
                                'move'   => true,
                            ],
                        ],
                        [
                            [
                                'core/heading',
                                [
                                    'level'   => 3,
                                    'content' => 'Funktion',
                                ],
                            ],
                            [
                                'core/paragraph',
                                [
                                    'placeholder' => 'z. B. Co-Geschäftsleitung, Kitaleitung Kita Ibach…',
                                ],
                            ],
                        ],
                    ],
                    [
                        'ud-betreuungsparadies/content-card',
                        [
                            'gradient'  => 'linear-gradient(180deg, #C5E6B1 0%, #B5D99C 100%)',
                            'cardWidth' => '480px',
                            'lock'      => [
                                'remove' => true,
                                'move'   => true,
                            ],
                        ],
                        [
                            [
                                'core/heading',
                                [
                                    'level'   => 3,
                                    'content' => 'Ausbildung',
                                ],
                            ],
                            [
                                'core/paragraph',
                                [
                                    'placeholder' => 'z. B. Fachfrau Betreuung EFZ, Weiterbildung…',
                                ],
                            ],
                        ],
                    ],
                    [
                        'ud-betreuungsparadies/content-card',
                        [
                            'gradient' => 'linear-gradient(180deg, #C0ECF0 0%, #A7E3E8 100%)',
                            'lock'     => [
                                'remove' => true,
                                'move'   => true,
                            ],
                        ],
                        [
                            [
                                'core/heading',
                                [
                                    'level'   => 3,
                                    'content' => 'In der Kita Paradies seit',
                                ],
                            ],
                            [
                                'core/paragraph',
                                [
                                    'placeholder' => 'z. B. seit 2025',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],

    ];

    register_post_type('ud_team', $args);
}
add_action('init', 'ud_team_cpt_register_post_type');
