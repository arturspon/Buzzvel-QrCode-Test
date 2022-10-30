<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Models\Page;

class PageController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StorePageRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePageRequest $request)
    {
        DB::beginTransaction();

        $page = Page::create($request->all());
        $page->links()->attach($request->links);

        DB::commit();

        return response()->json($page);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\Response
     */
    public function show(string $page)
    {
        $page = Page::where(['name' => $page])->first();

        if (empty($page)) {
            return response('Not found', 404);
        }

        return response()->json($page);
    }
}
