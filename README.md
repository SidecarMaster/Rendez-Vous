# Rendez-Vous

## How to Run the application
  1. Download the Github Repo.
  2. Set up a HTTP Server. For Mac OS, you can do it with Python. In the terminal, change the directory to the folder, and run the following command line ```python -m SimpleHTTPServer```. Feel free to use your own method to set up a HTTP server.
  3. Open your browser and navigate to the following address: http://127.0.0.1:8000. And now you have successfully run the application.

## How To Use the Application
  This is an application to show the 10 must-see attractions in Shanghai.
  1. Responsive Interface:
     - In the desktop mode, a panel on the left side of the website shows the 10 must-see attractions in Shanghai.
     - In the phone mode, you may click the burger-menu at the upper-right corner, and the panel will display.

  2. Real Time Updates
     - In the panel, there is an input box and a list of 10 attractions under it. In the input box, when you type in the name of an attraction, the list below it updates instantly, only displaying attractions that include the characters you type in.
     - And the markers in the map will also update accordingly.

  3. Indicative Animation and Informative Info Window
     - When you click on an item in the list in the panel, or directly on a marker in the map, the map will set the marker as the center of the map, and zoom to the area of the marker.
     - The marker will start bouncing.
     - Also an Info Window will pop up, displaying a panorama street view and the name of the attraction, as well as wikipedia links related to the attraction.
     - When you close the Info Window, the marker will stop bouncing, and the map will zoom out to fit all markers inside the map.

## Libraries, Frameworks, and Third-party APIs
  1. Organizational Framework: Knockout.
  2. Javascript library: jQuery.
  3. CSS framework: Bootstrap.
  4. Third-party APIs: Google Maps Javascript API, Wikipedia API.
