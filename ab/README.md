# ab-performance-testing

Find the API's here: https://dummy.restapiexample.com/

commands for requests 
    
GET     
`ab -n request_count -c concurrency_count endpoint`     
For example:        
ab -n 100 -c 10 http://dummy.restapiexample.com/api/v1/employees

POST     
`ab -n request_count -c concurrency_count -p path_to_file -T content_type endpoint`     
For example:        
ab -n 100 -c 10 -p ./inputFiles/create.json -T application/json http://dummy.restapiexample.com/api/v1/create

To generate a file which contains results of your test, append ` > path_to_output_file`     
For example:        
ab -n 100 -c 10 http://dummy.restapiexample.com/api/v1/employees > ./outputFiles/getEmployees.txt