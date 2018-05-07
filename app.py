from flask import Flask, Response, render_template, redirect, url_for, request
import requests
from pprint import pprint
import sqlite3
from db import dbaccess,timer
import json
import gevent
from gevent.wsgi import WSGIServer
from gevent.queue import Queue
import pdb
# create the application object
class ServerSentEvent(object):

    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data : "data",
            self.event : "event",
            self.id : "id"
        }

    def encode(self):
        if not self.data:
            return ""
        lines = ["%s: %s" % (v, k) 
                 for k, v in self.desc_map.iteritems() if k]
        
        return "%s\n\n" % "\n".join(lines)




app = Flask(__name__)

# Global variable
success_string=""
sdnController=""
solicitudes=[{'user':'user1','pagina': 'mipagina', 'motivo':'Quiero entrar', 'tiempodesde' : 1525849320000, 'tiempohasta':1525849320000 }, {'user':'use3443','pagina': 'mipagina', 'motivo':'Quiero ver', 'tiempodesde' : 1525849320000, 'tiempohasta': 1525849320000}]

@app.route('/user_view/<user>',methods=['GET', 'POST'])
def userView(user):
    if request.method == 'GET':
        return render_template('user_request_view.html',usuario=user )
    if request.method == 'POST':
        # pdb.set_trace()
        usuario = str(user)
        pagina = str(request.form['direccionurl'])
        motivo = str(request.form['motivo'])
        print motivo
        print usuario
        
        # evict_time_desde = str(request.form['evict_time_desde'])
        # evict_time_hasta = str(request.form['evict_time_hasta'])
        evict_time_desde = str(1525541016671)
        evict_time_hasta = str(1525541056671)

        # if not evict_time:
        #     evict_time_int = 0
        # else:
        #     evict_time_int = int(evict_time)
        status = "Offline"
        item = {'user': str(usuario),'pagina': str(pagina), 'motivo':str(motivo),'tiempodesde':int(evict_time_desde),'tiempohasta':int(evict_time_hasta)}
        solicitudes.append(item)
        items = solicitudes

        return render_template('user_request_view.html',usuario=user)


@app.route('/admin_view',methods=['GET', 'POST'])
def adminView():
    error =None
    global solicitudes
    if request.method == 'GET':
        items = solicitudes
        return render_template('admin_view.html')

# Redirects to user login page
@app.route('/')
def home():
    return redirect(url_for('userLogin'))  

# User adding page
@app.route('/user_add',methods=['GET', 'POST'])
def userAdd():
    error =None

    if request.method == 'GET':
        items = dbaccess.getAllUsers()
        return render_template('user_add.html',items=items)

    if request.method == 'POST':
        username = str(request.form['username'])
        passwd = str(request.form['password'])
        user_group = str(request.form['user_group'])
        evict_time = str(request.form['evict_time'])
        if not evict_time:
            evict_time_int = 0
        else:
            evict_time_int = int(evict_time)
        status = "Offline"

        dbaccess.insertBeforeLogin(username,passwd,user_group,evict_time_int,status)
        items = dbaccess.getAllUsers()

        return render_template('user_add.html',items=items)
    
    return render_template('user_add.html',error=error)


# Adding new server details
@app.route('/server_add', methods=['GET','POST'])
def serverAdd():
    error =None
    global sdnController

    if request.method == 'GET':
        items = dbaccess.getServertable()
        return render_template('server_add.html',items=items)

    if request.method == 'POST':
        internal_ip = str(request.form['internal'])
        external_ip = str(request.form['external'])
        authServer_ip = str(request.form['authentication'])
        internal_mac = str(request.form['internal_mac'])
        external_mac = str(request.form['external_mac'])
        authServer_mac = str(request.form['authentication_mac'])
        internal_port = str(request.form['internal_port'])
        external_port = str(request.form['external_port'])
        authServer_port = str(request.form['authentication_port'])
        sdnController_ip = str(request.form['sdnController'])
        dbaccess.insertServertable(internal_ip,external_ip,authServer_ip,internal_mac,external_mac, \
            authServer_mac,internal_port,external_port,authServer_port,sdnController_ip)
        items = dbaccess.getServertable()


        server_config = dbaccess.getServerconfig()
        sdnController = server_config['sdnController_ip']
        url = 'http://'+sdnController+':5010/serverconfig'
        del(server_config['sdnController_ip'])

        sendConfig(server_config,url)

        return render_template('server_add.html',items=items)

    return render_template('server_add.html')


# Returns login success page
@app.route('/login_success', methods=['GET','POST'])
def loginSuccess():
    return render_template('login_success.html', success_string=success_string)


# Admin login page
@app.route('/admin_login',methods=['GET','POST'])
def admin():
    error =None

    sample_dict = (vars(request))
    sam_dict = sample_dict['environ']

    if request.method == 'POST':
        if request.form['username'] != 'admin' or request.form['password'] != 'admin':
            error = 'Invalid Credentials'
        else:
            return redirect(url_for('userAdd'))
    
    return render_template('admin_login.html',error=error)

#Deleting the user
@app.route('/user_delete',methods=['GET','POST'])
def userDelete():
    error =None
    sample_dict = (vars(request))

    if request.method == 'GET':
        items = dbaccess.getAllUsers()
        return render_template('user_delete.html',items=items)

    if request.method == 'POST':
        username = str(request.form['username'])
        user_dict = dbaccess.getUserDetails(username)
        dbaccess.deleteUser(username)
        success = "User successfully deleted !!"
        data = {'user_name':user_dict['name'], 'ip_address':user_dict['ip_addr'],'policy_type':user_dict['user_group']}
        
        server_config = dbaccess.getServerconfig()
        sdnController = server_config['sdnController_ip']
        url = 'http://'+sdnController+':5010/evictuser'
        sendConfig(data,url)

        items = dbaccess.getAllUsers()

        return render_template('user_delete.html',items=items)

   
    return render_template('user_delete.html',error=error)

# User Login page
@app.route('/user_login',methods=['GET','POST'])
def userLogin():
    error =None
    global success_string

    request_dict = (vars(request))
    environ_dict = request_dict['environ']
    ip_addr = str(environ_dict['REMOTE_ADDR'])

    if request.method == 'POST':
        if dbaccess.isOnline(str(request.form['username'])):
            username = str(request.form['username'])
            return redirect('user_view/' + username)
        elif not dbaccess.isValid(str(request.form['username']), str(request.form['password'])):
            error = 'Invalid Credentials'
        else:
            username = str(request.form['username'])

            # Device types being detected when the user logs in
            device = getDeviceType(environ_dict)
            ip_addr = str(environ_dict['REMOTE_ADDR'])
            status = "Online"

            dbaccess.insertAfterLogin(username,device,ip_addr,status)
            user_dict = dbaccess.getUserDetails(username)
            if user_dict['user_group'] != 'Employee':
                # Link timer here
                timer.startTimer(username,user_dict['evict_time'])
            
            data = {'user_name':user_dict['name'], 'ip_address':user_dict['ip_addr'],'policy_type':user_dict['user_group']}

            server_config = dbaccess.getServerconfig()
            sdnController = server_config['sdnController_ip']
            url = 'http://'+sdnController+':5010/authenticateduser'

            sendConfig(data,url)
            success_string = 'Your login is successful from your ' + device + " device with IP " + ip_addr + "."

            return redirect(url_for('loginSuccess'))
    return render_template('user_login.html',error=error)


# Sends configuration data to the controller
def sendConfig(data,url):
    data_json = json.dumps(data)
    print ('JSON being sent - ', data_json)
    print ('URL - ', url)
    headers = {'Content-type': 'application/json'}
    # response = requests.post(url, data=data_json, headers=headers)
    # pprint.pprint(response.json())

def getDeviceType(environ_dict):
    if 'Ubuntu' in environ_dict['HTTP_USER_AGENT']:
        device = "Ubuntu"
    elif 'Macintosh' in environ_dict['HTTP_USER_AGENT']:
        device = "Macintosh"
    elif 'iPad' in environ_dict['HTTP_USER_AGENT']:
        device = "iPad"
    elif 'iPhone' in environ_dict['HTTP_USER_AGENT']:
        device = "iPhone"
    elif 'iPod' in environ_dict['HTTP_USER_AGENT']:
        device = "iPod"
    elif 'Android' in environ_dict['HTTP_USER_AGENT']:
        device = "Android"
    elif 'Windows' in environ_dict['HTTP_USER_AGENT']:
        device = "Windows"
    else:
        device = "unknown"
    return device


def gen():
        global solicitudes
        try:
            while len(solicitudes) > 0:
                item=""
                print "Las solicitudes son: "
                print solicitudes           
                item = json.dumps(solicitudes.pop())
                print item
                ev = ServerSentEvent(str(item))
                yield ev.encode()
            # ev = ServerSentEvent("Nadie aun")
            # return ev.encode()
        except GeneratorExit: # Or maybe use flask signals
            print "error"

@app.route("/sus")
def subscribe():
    
    return Response(gen(), mimetype="text/event-stream")











# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
