<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="کارا ماشین وصال - صنایع کشاورزی">
    <title>کارا ماشین وصال</title>
    <link rel="icon" type="image/x-icon" href="/homepage/images/ICON-HEADER.png">
    <link rel="stylesheet" href="/farmix/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/farmix/assets/css/fontawesome.min.css">
    <link rel="stylesheet" href="/farmix/assets/css/magnific-popup.min.css">
    <link rel="stylesheet" href="/farmix/assets/css/slick.min.css">
    <link rel="stylesheet" href="/farmix/assets/css/style.css">
    @viteReactRefresh
    @vite(['resources/application/homepage/main.tsx'])
</head>
<body class="farmix-body">
    <div id="homepage-root"></div>
</body>
</html>
