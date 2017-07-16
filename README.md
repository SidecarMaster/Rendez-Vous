# Rendez-Vous

## How to Run the application
  1. Download the Github Repo.
  2. Set up a HTTP Server. For Mac OS, you can do it with Python. In the terminal, change the directory to the folder, and run the following command line ```python -m SimpleHTTPServer```. Feel free to use your own method to set up a HTTP server.
  3. Open your browser and navigate to the following address: http://127.0.0.1:8000. And now you have successfully run the application.

## How To Use the Application
  This is an application to show the points of interest (POI) in Shanghai.
  1. Responsive Interface:
     - In the phone mode, you may click the burger-menu at the upper-right corner, and the functional panel will display.
     - In the desktop mode, the panel will exist on the left side of the website.

  2. Real Time Updates
     - In the functional panel, there are three sections: first, an input section. Second, a section containing five buttons, each of which represents a type of POI. Third, a list of POI, which updates in real-time according to your input or the button you clicked on.
     - And the markers in the map will also update accordingly in real-time.

  3. Indicative Animation and Informative Info Window
     - When you click on an item in the list in the panel, or directly on a marker in the map, the map will set the marker as the center of the map, and zoom to the area of the marker.
     - An Info Window will pop up, displaying a panorama street view and wikipedia links related to the attraction.
     - When you close the Info Window, the map will zoom out to fit all markers inside the map.

## Technologies
  1. Organizational Framework: KnockoutJS.
  2. CSS framework: Bootstrap.
  3. Third-party APIs: Google Maps Javascript API, Wikipedia API.
  4. Build Tools: Grunt
  5. Photo Editing Tools: GIMP
