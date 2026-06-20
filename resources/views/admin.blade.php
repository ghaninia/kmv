<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>پنل مدیریت</title>
    @viteReactRefresh
    @vite(['resources/application/dashboard/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
