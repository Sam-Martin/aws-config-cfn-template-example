from __future__ import print_function
from urlparse import urlparse

import json
import urllib2
import boto3
import zipfile

s3_client = boto3.client('s3')

print('Loading function')

s3 = boto3.client('s3')

print('Loading function')


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    for function in event['LambdaFunctionsSource']:
        
        keyname = function[0]
        functionurl = function[1]
        
        print('Downloading File')
        response = urllib2.urlopen(functionurl)
        html = response.read()
        
        print('Writing file')
        f = open('/tmp/index.js','w')
        f.write(html) # python will convert \n to os.linesep
        f.close()
        
        print ('Zipping file')
        zip_name = zipfile.ZipFile('/tmp/index.zip', 'w')
        zip_name.write('/tmp/index.js', '/tmp/index.zip')
        
        print('Uploading file to s3')
        s3_client.upload_file('/tmp/index.zip', event['BucketName'], keyname)
        return keyname
    #raise Exception('Something went wrong')