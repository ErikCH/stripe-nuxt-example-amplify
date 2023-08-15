import { defineNuxtPlugin } from "#app";
import { Amplify, Auth } from "aws-amplify";
import aws_exports from "../aws-exports";

export default defineNuxtPlugin((nuxtApp) => {
  Amplify.configure({
    API: {
      endpoints: [
        {
          name: "StripeAPI",
          endpoint:
            "https://cugmcgwakf.execute-api.us-east-2.amazonaws.com/prod/",
          region: "us-east-2"
        }
      ]
    }
  });

  return {
    provide: {
      auth: Auth
    }
  };
});
