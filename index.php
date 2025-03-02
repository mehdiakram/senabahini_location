<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>বাংলাদেশ সেনানিবাস ম্যাপ</title>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css">
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Hind Siliguri', sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
            background: linear-gradient(135deg, #007BFF, #00d4ff);
            color: white;
        }
        
        h2 {
            margin-top: 20px;
            font-size: 28px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        #map {
            height: 600px;
            width: 90%;
            margin: 20px auto;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            position: relative;
            z-index: 1;
        }

        .search-container {
            position: relative;
            display: inline-block;
            margin-bottom: 10px;
            z-index: 1000;
        }
        
        #searchInput {
            width: 270px;
            padding: 10px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            text-align: center;
        }

        #searchResults {
            position: absolute;
            width: 270px;
            background: white;
            color: black;
            border-radius: 5px;
            max-height: 200px;
            overflow-y: auto;
            display: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: left;
            top: 40px;
        }

        .search-item {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #ddd;
        }

        .search-item:hover {
            background: #f0f0f0;
        }

        .button-container {
            margin-bottom: 15px;
        }

        button {
            padding: 10px 16px;
            margin: 5px;
            border: none;
            background-color: #ff6b6b;
            color: white;
            font-size: 16px;
            cursor: pointer;
            border-radius: 25px;
            transition: background 0.3s;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        button:hover {
            background-color: #ff4040;
        }
    </style>
</head>
<body>
    <h2>বাংলাদেশ সেনানিবাস ম্যাপ</h2>
    
    <div class="search-container">
        <input type="text" id="searchInput" placeholder="🔍 লোকেশন খুঁজুন...">
        <div id="searchResults"></div>
    </div>
    
    <div class="button-container">
        <button id="findNearest">📍 কাছাকাছি ৫টি লোকেশন দেখুন</button>
        <button id="resetMap">🔄 রিসেট করুন</button>
    </div>
    
    <div id="map"></div>
    
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    
    <!-- Custom JavaScript -->
    <script src="script.js"></script>
</body>
</html>
