create database Issues;
use Issues;
create table userissues(
id INT AUTO_INCREMENT PRIMARY KEY,
Query_Date date,
Query_Time time,
FirstName varchar(50),
LastName varchar(50),
Email varchar(100),
Rnumber numeric,
DescIssue text,
Remarks text
);
-- select * from userissues;
-- insert into userissues values(1,curdate() ,curtime() , 'Prajas' , 'Kulkarni' , '23110252@iitgn.ac.in' , 23110252 , 'I Have an issue with this sql query' , 'None');


