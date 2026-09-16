<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="کارا ماشین وصال - صنایع کشاورزی">
    <title>کارا ماشین وصال</title>
    <link rel="icon" type="image/x-icon" href="/homepage/images/ICON-HEADER.png">
    @viteReactRefresh
    @vite(['resources/application/homepage/main.tsx'])
</head>
<body>
    <div id="homepage-root"></div>
</body>
</html>
