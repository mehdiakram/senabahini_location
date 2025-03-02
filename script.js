document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map").setView([23.685, 90.3563], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    var divisionClusters = {};
    var allMarkers = [];
    var originalLayers = []; // রিসেটের জন্য মূল ডাটা সংরক্ষণ
    var userMarker = null;
    var nearestLayerGroup = L.layerGroup();

    // সার্চ ইনপুট এবং ড্রপডাউন লিস্ট
    var searchInput = document.getElementById("searchInput");
    var searchResults = document.getElementById("searchResults");

    // সেনানিবাসের তথ্য লোড করা
    fetch("army_locations.php")
        .then((response) => response.json())
        .then((data) => {
            Object.keys(data).forEach((division) => {
                if (!divisionClusters[division]) {
                    divisionClusters[division] = L.markerClusterGroup();
                }

                data[division].forEach((location) => {
                    var popupContent = `<b>${location.name}</b><br>📞 ফোন: ${location.phones.join(", ")}`;
                    var marker = L.marker([location.lat, location.lng]).bindPopup(popupContent);
                    
                    marker.locationData = location; // দূরত্ব হিসাবের জন্য ডাটা সংরক্ষণ
                    allMarkers.push(marker);
                    divisionClusters[division].addLayer(marker);
                });

                map.addLayer(divisionClusters[division]);
                originalLayers.push(divisionClusters[division]); // রিসেটের জন্য সংরক্ষণ
            });
        })
        .catch((error) => console.error("ডাটা লোড করতে সমস্যা হয়েছে:", error));

    // 🔍 সার্চ ফিচার
    searchInput.addEventListener("input", function () {
        var searchText = searchInput.value.toLowerCase();
        searchResults.innerHTML = ""; // আগের রেজাল্ট মুছুন

        if (searchText.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        var filteredLocations = allMarkers.filter((marker) =>
            marker.locationData.name.toLowerCase().includes(searchText)
        );

        if (filteredLocations.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        searchResults.style.display = "block";
        filteredLocations.forEach((marker) => {
            var listItem = document.createElement("div");
            listItem.textContent = marker.locationData.name;
            listItem.classList.add("search-item");

            listItem.addEventListener("click", function () {
                map.setView([marker.locationData.lat, marker.locationData.lng], 12);
                marker.openPopup();
                searchResults.style.display = "none";
                searchInput.value = "";
            });

            searchResults.appendChild(listItem);
        });
    });

    // 🔘 কাছের ৫টি লোকেশন খোঁজার ফাংশন
    document.getElementById("findNearest").addEventListener("click", function () {
        if (!navigator.geolocation) {
            alert("আপনার ব্রাউজার লোকেশন সার্ভিস সমর্থন করে না!");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                if (userMarker) {
                    map.removeLayer(userMarker);
                }

                userMarker = L.marker([userLat, userLng], {
                    icon: L.icon({
                        iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        iconSize: [30, 30],
                    }),
                }).bindPopup("<b>আপনার অবস্থান</b>").addTo(map);

                var locationsWithDistance = allMarkers.map((marker) => {
                    var loc = marker.locationData;
                    var distance = getDistance(userLat, userLng, loc.lat, loc.lng);
                    return { marker, distance };
                });

                locationsWithDistance.sort((a, b) => a.distance - b.distance);

                var nearestLocations = locationsWithDistance.slice(0, 5);

                originalLayers.forEach((layer) => map.removeLayer(layer));
                nearestLayerGroup.clearLayers();
                nearestLocations.forEach(({ marker, distance }) => {
                    marker.bindPopup(marker.getPopup().getContent() + `<br>দূরত্ব: ${distance.toFixed(2)} কিমি`);
                    nearestLayerGroup.addLayer(marker);
                });

                map.addLayer(nearestLayerGroup);
                map.setView([userLat, userLng], 10);
            },
            function () {
                alert("আপনার লোকেশন পাওয়া যায়নি!");
            }
        );
    });

    // 🌍 লোকেশন অনুসন্ধানের জন্য Distance ক্যালকুলেশন ফাংশন (Haversine Formula)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // 🔄 রিসেট ফাংশন
    document.getElementById("resetMap").addEventListener("click", function () {
        if (userMarker) {
            map.removeLayer(userMarker);
            userMarker = null;
        }

        nearestLayerGroup.clearLayers();
        originalLayers.forEach((layer) => map.addLayer(layer));
        map.setView([23.685, 90.3563], 7);
    });
});
