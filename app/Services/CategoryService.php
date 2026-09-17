<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Http\UploadedFile;

class CategoryService
{
    public function setCoverImage(Category $category, UploadedFile $image): void
    {
        $category->clearMediaCollection('cover');
        $category->addMedia($image)->toMediaCollection('cover');
    }

    public function deleteCoverImage(Category $category): bool
    {
        $media = $category->getFirstMedia('cover');

        if ($media) {
            $media->delete();

            return true;
        }

        return false;
    }

    public function clearMedia(Category $category): void
    {
        $category->clearMediaCollection('cover');
    }
}
