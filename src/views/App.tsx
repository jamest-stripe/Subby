import { Banner, Button, Box, ContextView, Inline, Link, TableHeaderCell, Table, TableHead, TableRow, TableBody, Spinner, Icon, List, ListItem } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import BrandIcon from "./brand_icon.svg";
import { Stripe } from "stripe";
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { useState, useEffect, useCallback } from 'react';
/**
 * This is a view that is rendered in the Stripe dashboard's customer detail page.
 * In stripe-app.json, this view is configured with stripe.dashboard.customer.detail viewport.
 * You can add a new view by running "stripe apps add view" from the CLI.
 */


//Initialise Stripe Client
const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-08-01',
});


const CustomerDetailView = ({ userContext, environment }: ExtensionContextValue) => {
  const BASE_URL =
    environment.mode == "test"
      ? `https://dashboard.stripe.com/${environment.mode}`
      : `https://dashboard.stripe.com`;
  const [schedules, setSchedules] = useState<Stripe.SubscriptionSchedule[]>();

  const getSchedules = useCallback(async () => {
    const data = await stripe.subscriptionSchedules.list({customer:environment.objectContext?.id});
    setSchedules(data.data);
  }, []);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);


//View Components//
  return (
    <ContextView title="Schediule View">
      <Box
        css={{
          padding:'large',
          backgroundColor:'container',
          borderRadius: 'small',
        }}>
          <List>
            {schedules && schedules.map((schedules)=>(
             
              <ListItem
              value={
                <Button onPress={() => alert('edit')} type="primary" disabled='false'>
                Edit
                </Button>
              }
              id={schedules.id}
              title={<Box css={{fontSize:'xsmall'}}>Schedule {schedules.subscription}</Box>}
              secondaryTitle={<Box>{schedules.status}</Box>}
              />
            ))}
          </List>

      </Box>
    </ContextView>
  );
};

export default CustomerDetailView;
//not_started, active, completed, released, and canceled