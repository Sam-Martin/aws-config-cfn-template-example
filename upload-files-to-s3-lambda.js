console.log('Loading event');
var http = require('http');
var https = require('https');
var url = require('url');
var aws = require('aws-sdk');
var s3 = new aws.S3();
exports.handler = function (event, context) {
  
    // Loop through the lambda functions we've been asked to download
    event.LambdaFunctionsSource.forEach(function(lambdaURL){
        
        lambdaURL = url.parse(lambdaURL)
        console.log(lambdaURL)
        if (lambdaURL.protocol == 'http:'){
            webrequest = http
        }else if(lambdaURL.protocol == 'https:'){
            webrequest = https
        }else{
            context.done('Could not recognise protocol \''+lambdaURL.protocol+'\'')
        }
        var options = {
          host: lambdaURL.host,
          port: 443,
          path: lambdaURL.pathname
        };
        webrequest.get(options, function(response) {
          console.log("Got response: " + response.statusCode);
          
          // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var bucketKey = lambdaURL.pathname.replace(/^\//,'')
            console.log("Retrieved page");
            s3.putObject({
              Bucket: event.BucketName,
              Key: bucketKey,
              ACL: 'private',
              Body: body,
              ContentDisposition: 'inline',
              ContentType: 'text/plain'
            }, function (err, data) {
              if (err) {
                context.fail('Error adding object to bucket ' + event.bucketName + ' - ' + JSON.stringify(err));
              }
              context.done(null, {
                key: bucketKey,
                bucketName: event.bucketName,
              });
            });
        });
          
          
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });    
    })
    
  
  /* Upload the object to s3
   */
};