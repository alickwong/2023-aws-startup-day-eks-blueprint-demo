import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as blueprints from "@aws-quickstart/eks-blueprints";
import {CfnOutput} from "aws-cdk-lib";


export class EksBlueprintGenaiConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const account = '';
    const region = '';
    const version = 'auto';
    const blueprintStackName = 'eks-blueprint-genai';

    const addOns: Array<blueprints.ClusterAddOn> = [
      new blueprints.addons.VpcCniAddOn(),
      new blueprints.addons.CoreDnsAddOn(),
      new blueprints.addons.KubeProxyAddOn(),
      new blueprints.addons.GpuOperatorAddon(),
      new blueprints.addons.KarpenterAddOn(),
    ];

    let blueprint = blueprints.EksBlueprint.builder()
      .account(account)
      .region(region)
      .version(version)
      .addOns(...addOns)
      .build(scope, blueprintStackName);

    let serviceAccount = blueprint.getClusterInfo().cluster.addServiceAccount('consumer-service-account', {
      name: 'consumer-service-account',
      namespace: 'default'
    });

    serviceAccount.addToPrincipalPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "sqs:*",
          "s3:*"
        ],
        resources: [
          '*'
        ]
      }
    ));

    // example resource
    const queue = new sqs.Queue(blueprint, 'EksBlueprintGenaiQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });
    new CfnOutput(blueprint, 'genai-sqs', {value: queue.queueUrl});
  }
}
