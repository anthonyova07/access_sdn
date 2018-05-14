import sqlite3

# Creating required database tables 
def createDB():
	conn = sqlite3.connect('test.db')

	conn.execute('''CREATE TABLE usertable
	       (name TEXT PRIMARY KEY     NOT NULL,
	       pass           TEXT    NOT NULL,
	       user_group	TEXT,
		   	 evict_time		INT,
	       device        TEXT,
	       ip_addr         TEXT,
	       status			TEXT);''')

	conn.execute('''CREATE TABLE servertable
	       (internal_ip 	TEXT,
	       	external_ip		TEXT,
	       	authServer_ip	TEXT,
	       	internal_mac	TEXT,
	       	external_mac	TEXT,
	       	authServer_mac 	TEXT,
	       	internal_port	TEXT,
	       	external_port	TEXT,
	       	authServer_port 	TEXT,
	       	sdnController_ip	TEXT);''')

	conn.execute('''CREATE TABLE `userequest` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`username`	TEXT NOT NULL,
	`urladdress`	TEXT NOT NULL,
	`commentary`	TEXT,
	`initial_time`	TEXT NOT NULL,
	`final_time`	TEXT NOT NULL,
	`status`	TEXT NOT NULL
							);''')
	print ("Tables created successfully");

	conn.close()

createDB()