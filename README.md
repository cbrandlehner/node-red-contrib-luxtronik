node-red-contrib-luxtronik
==========================

Node-Red (http://nodered.org) node for communicating with a Luxtronik heatpump controller. 


#Install

Run the following command after you have done a global install of Node-RED

	sudo npm install -g node-red-contrib-luxtronik

#Usage

The luxtronik node will appear in the "IoT" catagory on the Node-Red pallet. Drag and drop it onto the canvas and configure as you would any other node-red module. 

The luxtronik node allows you to set the IP-Address and Port of you heatpump controller.

Warning: Do not expose the ethernet connection of your luxtronik to the internet. The Linux system is not being updated by Alpha-Innotec and the root account has a default password.

#Disclaimer

Use this node at your own risk.

# Author

Christian Brandlehner, https://github.com/cbrandlehner

#More Info on Luxtronik

A more powerful tool and background info on the API can be found at https://sourceforge.net/projects/opendta/