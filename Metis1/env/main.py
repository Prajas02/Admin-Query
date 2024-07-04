# importing flask and mysql 
from flask import Flask, render_template, request , redirect
from flask_mysqldb import MySQL

#importing libs for automated emails 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import os

app = Flask(__name__)

# configureing my sql initials to start with flask
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Zero@123'
app.config['MYSQL_DB'] = 'Issues'

mysql = MySQL(app)

# the landing page url
@app.route("/") 
def index(): 
    if request.method == "POST":
        try:
            login_data = request.form
            email = login_data.get('email')
            password = login_data.get('password')
            return render_template('indx.html')
        except Exception as e:
            print(f'Error {e}')
            return render_template('student-login.html')
    return render_template('student-login.html')

# function to submit query to database 
@app.route("/query", methods=['POST']) 
def query(): 
    try:
        form_data = request.form # requesting the form data using request module
        FirstName = form_data.get('fname')
        LastName = form_data.get('lname')
        Email = form_data.get('email')
        Rnumber = form_data.get('rnum')
        DescIssue = form_data.get('describe')
        cur = mysql.connection.cursor() 
        sql_query = "INSERT INTO userissues (Query_Date ,Query_Time ,FirstName, LastName, Email, Rnumber, DescIssue) VALUES (curdate(), curtime() ,%s, %s, %s,%s,%s);" # mysql command
        cur.execute(sql_query, (FirstName, LastName, Email, Rnumber, DescIssue))
        mysql.connection.commit() # query added to the database opertaion performed 
        cur.close()
        return render_template('index.html', success=True)
    except Exception as e: # for an error
        print(f"Error: {e}")
        return render_template('index.html', success=False, error=str(e))

# admin-login lading page
@app.route('/login')
def login():
    return render_template('login.html')

# user page which shows the query-data   
@app.route('/admin')
def admin():
    cur = mysql.connection.cursor()
    sql_query = 'Select * from userissues'
    cur.execute(sql_query)
    mysql.connection.commit()
    data = cur.fetchall() # fetching the data from the database.
    cur.close()
    return render_template('admin.html', query_data = data)

@app.route('/delete' , methods=['POST'])
def delete():
    try:
        id = request.form.get('value')
        cur = mysql.connection.cursor()
        sql_query = 'delete from userissues where id = %s ;'
        cur.execute(sql_query , (int(id),))
        mysql.connection.commit()
        cur.close()
        return redirect('user')
    except Exception as e:
        print(f'error{e}')
        return redirect('user')
    
@app.route('/resolveMessage' , methods = ['POST'])
def resolveMessage():
    try:
        id = request.form.get('value')
        resolvemessage = request.form.get('message')
        email = request.form.get('email')
        cur = mysql.connection.cursor()
        sql_query = 'UPDATE userissues SET Remarks = %s WHERE id = %s;'
        cur.execute(sql_query , (resolvemessage , id))
        mysql.connection.commit()
        cur.close()
        
        # making direct reply to the user
        smtp = smtplib.SMTP('smtp.gmail.com' ,587)
        smtp.ehlo()
        smtp.starttls()
        
        # setting up your google account
        smtp.login('thegreatking911@gmail.com' ,'dvdvdqyshrveuzjb')
        
        def message(subject = 'Query Resolved' , text=""):
            msg = MIMEMultipart()
            msg['Subject'] = subject
            msg.attach(MIMEText(text))
            return msg
        
        msg = message("Query Resolved" , resolvemessage) 
        
        #sending the email 
        to = [email]       
        smtp.sendmail(from_addr="IITGN@gmail.com" , to_addrs=to , msg=msg.as_string())
        smtp.quit()
        
        return redirect('user')
    except Exception as e:
        print(f'error {e}')
        return redirect('user')

if __name__ == '__main__':
    app.run(debug=True)
