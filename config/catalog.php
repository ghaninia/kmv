<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Catalog Public Link Password Length
    |--------------------------------------------------------------------------
    |
    | Length used by the dashboard password generator when creating a random
    | password for a public catalog link. Adjust via the CATALOG_PASSWORD_LENGTH
    | environment variable.
    |
    */

    'password_length' => (int) env('CATALOG_PASSWORD_LENGTH', 12),

];
