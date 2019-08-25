import * as cdk from '@aws-cdk/core'
import { HelloCdkStack } from './hello-cdk-stack'

const app = new cdk.App()
new HelloCdkStack(app, 'HelloCdkStack')
