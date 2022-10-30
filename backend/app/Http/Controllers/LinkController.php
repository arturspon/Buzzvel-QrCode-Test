<?php

namespace App\Http\Controllers;

use App\Models\Link;

class LinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $links = Link::orderBy('label')->get();
        return response()->json($links);
    }
}
