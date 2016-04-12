# aws-config-cfn-template-example
An example CloudFormation template for setting up AWS Config rules.

# Usage
This is intended to be the simplest possible example of creating AWS Config Rules using a CloudFormation Template.  
It has ended up far longer than I'd like for reasons exaplained in the "Why so much Lambda?" section

# Why so much Lambda?
Due to the unique constraints (i.e. that there can be only one of each) enforced on the Delivery Channel and Delivery Recorder resources, combined with the simultaneous creation requirement *and* the fact that once created you cannot delete the Delivery Recorder object, it is at the time of writing (12/04/2016) impossible to reliable control AWS Config using CloudFormation on its own.  
To get around these constraints we must ensure that Delivery Recorder either does not exist at all, or if it does exist, has a valid IAM role assigned to it with permission to write to our desired S3 bucket.  
In theory this should be possible using the CFN resource `AWS::Config::ConfigurationRecorder`, but because this resources 'turns on' the Recorder as part of creation, it must be created after the Delivery Channel.  
This is where our dependency becomes circular, because if the existing Configuration Recorder has an IAM Role which does not have access to write to our specified S3 bucket we cannot create the Delivery Channel. We are then left in a scenario where we can't change the IAM role to create the Channel and we can't create the Channel to control the Recorder!  
The only way out of this is to bring in Lambda after we've created the IAM role in order to apply it to the Configuration Recorder without turning it on.