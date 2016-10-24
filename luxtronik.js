/**
* node-red module to access data from a luxtronik controller
**/


module.exports = function(RED) {
	"use strict";
	
	/* common code */
	var debug = true; // set true for more debugging info

	function translate(c)	
	{
		var tools = require(__dirname+'/lib/tools.js');
		var channellist = require(__dirname+'/lib/channellist.json');
		if (debug) {console.log('Homebridge-Luxtronik2: translating data');};
		// translate dword to data type
			var result = [];
			for (var i=0;i< c.length; i++)
			{
				if (tools.isset(channellist[i]))
				{
					var value = c[i];
					if (tools.isset(channellist[i].type))
					{
						switch (channellist[i].type)
						{
						case 'fix1':
							value /= 10;
							break;
						case 'ip':
							value = tools.int2ip(value);
							break;
						case 'unixtime':
							value = new Date(value * 1000).toISOString();
							break;
						case 'timestamp':
							/* do nothing here, used for future feature. mysql table creation */
							break;
						case 'ignore':
							continue;
							break;
						case 'enum':
							if (tools.isset(channellist[i].enum[c[i]]))
							{
								value = channellist[i].enum[c[i]];
							}
							break;
						}
					}
					// push to array
				result.push(value);
				}
			}
			return result;
		}	// function translate(c)	

    function ReadLuxtronik(node,config,msg,callback) {
//        var temp;

		node.log('node-red-contrib-luxtronik: configuration is ' + config.ip + ':' + config.port);
            msg.payload = {};

			var net = require('net');

			var luxsock = net.connect({host:config.ip, port: config.port});

			if (debug) {console.log("node-red-contrib-luxtronik: Going to connect");};
			/* handle error */
			luxsock.on("error", function (data)
			{
				if (debug) {console.log('node-red-contrib-luxtronik: (Debug, data toString) ' + data.toString());};
				console.error(data.toString());
				//stop();
			});
			/* handle timeout */
			luxsock.on("timeout", function ()
			{
				if (debug) {console.log('node-red-contrib-luxtronik: connection timeout');};
				console.warn("node-red-contrib-luxtronik: client timeout event");
				//stop();
			});
			/* handle close */
			luxsock.on("close", function ()
			{
				if (debug) {console.log("node-red-contrib-luxtronik: client close event");};
				//stop();
			});
			/* handle end */
			luxsock.on('end', function ()
			{
				if (debug) {console.log("node-red-contrib-luxtronik: client end event");};
				//stop();
			});
			// connected => get values
			luxsock.on('connect', function()
			{
				if (debug) {console.log('node-red-contrib-luxtronik: connected!');};
				luxsock.setNoDelay(true);
				luxsock.setEncoding('binary');
				var buf = new Buffer(4);
				buf.writeUInt32BE(3004,0);
				luxsock.write(buf.toString('binary'), 'binary');
				buf.writeUInt32BE(0,0);
				luxsock.write(buf.toString('binary'), 'binary');
			});
			/* receive data */
			luxsock.on('data', function(data)
			{
				if (debug) {console.log('node-red-contrib-luxtronik: reading data');};
				var buf = new Buffer(data.length);
				buf.write(data, 'binary');
				/* luxtronik must confirm command */
				var confirm = buf.readUInt32BE(0);
				/* is 0 if data is unchanged since last request */
				var change = buf.readUInt32BE(4);
				/* number of values */
				var count = buf.readUInt32BE(8);
				if (confirm != 3004)
				{
					if (debug) {console.log('node-red-contrib-luxtronik: command not confirmed');};
					stop();
				}
				else if (data.length==count*4+12)
				{
					var pos = 12;
					var calculated = new Int32Array(count);
					for (var i=0;i<count;i++)
					{
						calculated[i] = buf.readInt32BE(pos);
						pos+=4;
					}
					var items = translate(calculated);
			var channels = ["1","2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Temperatur_TVL",
    "Temperatur_TRL",
    "Sollwert_TRL_HZ",
    "Temperatur_TRL_ext",
    "Temperatur_THG",
    "Temperatur_TA",
    "Mitteltemperatur",
    "Temperatur_TBW",
    "Einst_BWS_akt",
    "Temperatur_TWE",
    "Temperatur_TWA",
    "Temperatur_TFB1",
    "Sollwert_TVL_MK",
    "Temperatur_RFV",
    "Temperatur_TFB2",
    "Sollwert_TVL_MK2",
    "Temperatur_TSK",
    "Temperatur_TSS",
    "Temperatur_TEE",
    "ASDin",
    "BWTin",
    "EVUin",
    "HDin",
    "MOTin",
    "NDin",
    "PEXin",
    "SWTin",
    "AVout",
    "BUPout",
    "HUPout",
    "MA1out",
    "MZ1out",
    "VENout",
    "VBOout",
    "VD1out",
    "VD2out",
    "ZIPout",
    "ZUPout",
    "ZW1out",
    "ZW2SSTout",
    "ZW3SSTout",
    "FP2out",
    "SLPout",
    "SUPout",
    "MZ2out",
    "MA2out",
    "Zaehler_BetrZeitVD1",
    "Zaehler_BetrZeitImpVD1",
    "Zaehler_BetrZeitVD2",
    "Zaehler_BetrZeitImpVD2",
    "Zaehler_BetrZeitZWE1",
    "Zaehler_BetrZeitZWE2",
    "Zaehler_BetrZeitZWE3",
    "Zaehler_BetrZeitWP",
    "Zaehler_BetrZeitHz",
    "Zaehler_BetrZeitBW",
    "Zaehler_BetrZeitKue",
    "Time_WPein_akt",
    "Time_ZWE1_akt",
    "Time_ZWE2_akt",
    "Timer_EinschVerz",
    "Time_SSPAUS_akt",
    "Time_SSPEIN_akt",
    "Time_VDStd_akt",
    "Time_HRM_akt",
    "Time_HRW_akt",
    "Time_LGS_akt",
    "Time_SBW_akt",
    "Code_WP_akt",
    "BIV_Stufe_akt",
    "WP_BZ_akt",
    "SoftStand1",
    "SoftStand2",
    "SoftStand3",
    "SoftStand4",
    "SoftStand5",
    "SoftStand6",
    "SoftStand7",
    "SoftStand8",
    "SoftStand9",
    "SoftStand10",
    "AdresseIP_akt",
    "SubNetMask_akt",
    "Add_Broadcast",
    "Add_StdGateway",
    "ERROR_Time0",
    "ERROR_Time1",
    "ERROR_Time2",
    "ERROR_Time3",
    "ERROR_Time4",
    "ERROR_Nr0",
    "ERROR_Nr1",
    "ERROR_Nr2",
    "ERROR_Nr3",
    "ERROR_Nr4",
    "AnzahlFehlerInSpeicher",
    "Switchoff_file_Nr0",
    "Switchoff_file_Nr1",
    "Switchoff_file_Nr2",
    "Switchoff_file_Nr3",
    "Switchoff_file_Nr4",
    "Switchoff_file_Time0",
    "Switchoff_file_Time1",
    "Switchoff_file_Time2",
    "Switchoff_file_Time3",
    "Switchoff_file_Time4",
    "Comfort_exists",
    "HauptMenuStatus_Zeile1",
    "HauptMenuStatus_Zeile2",
    "HauptMenuStatus_Zeile3",
    "HauptMenuStatus_Zeit",
    "HauptMenuAHP_Stufe",
    "HauptMenuAHP_Temp",
    "HauptMenuAHP_Zeit",
    "SH_BWW",
    "SH_HZ",
    "SH_MK1",
    "SH_MK2",
    "Einst_Kurzrpgramm",
    "StatusSlave_1",
    "StatusSlave_2",
    "StatusSlave_3",
    "StatusSlave_4",
    "StatusSlave_5",
    "AktuelleTimeStamp",
    "SH_MK3",
    "Sollwert_TVL_MK3",
    "Temperatur_TFB3",
    "MZ3out",
    "MA3out",
    "FP3out",
    "Time_AbtIn",
    "Temperatur_RFV2",
    "Temperatur_RFV3",
    "SH_SW",
    "Zaehler_BetrZeitSW",
    "FreigabKuehl",
    "AnalogIn",
    "SonderZeichen",
    "SH_ZIP",
    "WebsrvProgrammWerteBeobarten",
    "WMZ_Heizung",
    "WMZ_Brauchwasser",
    "WMZ_Schwimmbad",
    "WMZ_Seit",
    "WMZ_Durchfluss",
    "AnalogOut1",
    "AnalogOut2",
    "Time_Heissgas"
];
					if (debug) {
						for (var i=0;i<items.length;i++)
						{
							console.log('node-red-contrib-luxtronik: data item ', i, ' ', channels[i+10],items[i] );
						}
					};
					msg.payload.Temperatur_TVL = items[0];
					msg.payload.Temperatur_TRL = items[1];
					msg.payload.Sollwert_TRL_HZ = items[2];
					msg.payload.Temperatur_TRL_ext = items[3];
					msg.payload.Temperatur_THG = items[4];
					msg.payload.Temperatur_TA = items[5];
					msg.payload.Mitteltemperatur = items[6];
					msg.payload.Temperatur_TBW = items[7];
					msg.payload.Einst_BWS_akt = items[8];
					msg.payload.Temperatur_TWE = items[9];
					msg.payload.Temperatur_TWA = items[10];
					msg.payload.Temperatur_TFB1 = items[11];
					msg.payload.Sollwert_TVL_MK = items[12];
					msg.payload.Temperatur_RFV = items[13];
					msg.payload.Temperatur_TFB2 = items[14];
					msg.payload.Sollwert_TVL_MK2 = items[15];
					msg.payload.Temperatur_TSK = items[16];
					msg.payload.Temperatur_TSS = items[17];
					msg.payload.Temperatur_TEE = items[18];
					msg.payload.ASDin = items[19];
					msg.payload.BWTin = items[20];
					msg.payload.EVUin = items[21];
					msg.payload.HDin = items[22];
					msg.payload.MOTin = items[23];
					msg.payload.NDin = items[24];
					msg.payload.PEXin = items[25];
					msg.payload.SWTin = items[26];
					msg.payload.AVout = items[27];
					msg.payload.BUPout = items[28];
					msg.payload.HUPout = items[29];
					msg.payload.MA1out = items[30];
					msg.payload.MZ1out = items[31];
					msg.payload.VENout = items[32];
					msg.payload.VBOout = items[33];
					msg.payload.VD1out = items[34];
					msg.payload.VD2out = items[35];
					msg.payload.ZIPout = items[36];
					msg.payload.ZUPout = items[37];
					msg.payload.ZW1out = items[38];
					msg.payload.ZW2SSTout = items[39];
					msg.payload.ZW3SSTout = items[40];
					msg.payload.FP2out = items[41];
					msg.payload.SLPout = items[42];
					msg.payload.SUPout = items[43];
					msg.payload.MZ2out = items[44];
					msg.payload.MA2out = items[45];
					msg.payload.Zaehler_BetrZeitVD1 = items[46];
					msg.payload.Zaehler_BetrZeitImpVD1 = items[47];
					msg.payload.Zaehler_BetrZeitVD2 = items[48];
					msg.payload.Zaehler_BetrZeitImpVD2 = items[49];
					msg.payload.Zaehler_BetrZeitZWE1 = items[50];
					msg.payload.Zaehler_BetrZeitZWE2 = items[51];
					msg.payload.Zaehler_BetrZeitZWE3 = items[52];
					msg.payload.Zaehler_BetrZeitWP = items[53];
					msg.payload.Zaehler_BetrZeitHz = items[54];
					msg.payload.Zaehler_BetrZeitBW = items[55];
					// there are some more. TODO: map data to output

					callback(); // fear the callback hell
				}
				luxsock.end();
			});
    }

	function LuxtronikQueryNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.name = config.name;
    	this.ip = config.ip;
    	this.port = config.port;
    	node.log('node-red-contrib-luxtronik: configuration is ' + config.ip + ':' + config.port);

        this.on ('input', function(msg) {
            ReadLuxtronik(node, config, msg, function(){
                node.send(msg);
            });
        });
	}

    RED.nodes.registerType("luxtronik",LuxtronikQueryNode);
}
