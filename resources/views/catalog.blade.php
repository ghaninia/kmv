<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#0f172a">
    <title>Product Catalog</title>
    @viteReactRefresh
    @vite(['resources/application/catalog/main.tsx'])
</head>
<body class="bg-slate-100 antialiased">
    <div id="catalog-root"></div>
</body>
</html>
