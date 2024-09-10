<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crystal Clean Sydney</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('frontend') }}/style.css">
    <link rel="stylesheet" href="{{ asset('frontend') }}/styles.css">
    <link rel="stylesheet" href="{{ asset('frontend') }}/css/services.css">
    <link rel="stylesheet" href="{{ asset('frontend') }}/responsive.css">
</head>

<body>
    @include('layouts.inc.header')
    <!-- main content start  -->
     @yield('main_content')
    <!-- main content end -->
    @include('layouts.inc.footer')
    <!-- footer end  -->
    @include('layouts.inc.script')
</body>

</html>