<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $links = ['LinkedIn', 'Github'];

        foreach ($links as $link) {
            DB::table('links')->insert([
                'label' => $link,
            ]);
        }
    }
}
