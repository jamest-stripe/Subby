import { Banner, Button, Box, ContextView, Divider, FormFieldGroup, Inline, Link, TableHeaderCell, Table, TableHead, TableRow, TableBody, Spinner, Icon, List, ListItem, Badge, FocusView, Select, TextField, TableCell } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";

import BrandIcon from "./brand_icon.svg";
import { Stripe } from "stripe";
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';
import { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import { generate } from "shortid";
import shortid from "shortid";
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
  const [showDataInput, setShowDataInput] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Stripe.SubscriptionSchedule[]>();
  const [prices, setPrices] = useState<Stripe.Price[]>();
  const [coupons, setCoupons] = useState<Stripe.Coupon[]>();
  const [items, setItems] = useState<Item[]>([]);
  interface Item {
    id:string
    price: string
    iterations:string
    coupon:string
  }
  

  //Get Current Subscription Schedules
  const getSchedules = useCallback(async () => {
    const data = await stripe.subscriptionSchedules.list({customer:environment.objectContext?.id,});
    setSchedules(data.data);
  }, []);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

//Get Products and Extend Prices
const getPrices = useCallback(async () => {
  const data = await stripe.prices.list({active:true, expand:['data.product']});
  setPrices(data.data);
}, []);

useEffect(() => {
  getPrices();
}, [getPrices]);

//Get Coupons
const getCoupons = async () => {
  const data = await stripe.coupons.list();
  setCoupons(data.data);
}

useEffect(() =>{
  getCoupons();
}, [getCoupons]);

//Create the Schedule
//const phases = parsePhaseArray(items);
const createSchedule = () => {
  const phases = []
  for (let i = 0; i < items.length; i++){
    console.log(items[i]);
    phases.push({
        items: [
          {price: items[i].price, quantity: 1}
          ],
        iterations: items[i]?.iterations || 1,
        coupon: items[i]?.coupon,
        metadata:{"array_id":items[i].id}
    })
  }
console.log(phases);
const now = Math.round(Date.now()/1000);
stripe.subscriptionSchedules.create({
  customer: environment.objectContext?.id,
  start_date:now,
  end_behavior:"release",
  phases:phases
})
}
//View Components//
  return (
    <ContextView 
    title="Active Subscription Schedules"
    description = {`Customer: ${userContext.account.name}`}
    primaryAction = {<Button type="primary" onPress={() => setShowDataInput(true)}>Create Subscription Schedule</Button>}
    >
      {/*Home Page View*/}
      <Box
        css={{
          //padding:'large',
          backgroundColor:'container',
          borderRadius: 'small',
        }}>
          <List>
            {schedules && schedules.map((schedule)=>(
              
             <ListItem
              key={schedule.id.toString()}
              value={
                <Button type="primary">
                  <Icon name = "external" size="xsmall"></Icon>
                </Button>
              }
              title={<Box>{schedule.subscription}</Box>}
              secondaryTitle={<Box>Status:{schedule.status}</Box>}
              id={schedule.id}
              />
))}
          </List>
      </Box>

    {/* Create New Schedule View */}
    <FocusView
      title="Create new subscription schedule"
      shown={showDataInput}
      onClose={() => setShowDataInput(false)}
      primaryAction={<Button type='primary' onPress={createSchedule} >Save</Button>}
      secondaryAction={<Button onPress={() => setShowDataInput(false)}>Cancel</Button>}
      >
        
       {items.map((i, index) => {
        return (
          <Box
          css={{
            width:'fill',
            paddingY:'small',
            //paddingRight:"xlarge",
            background: "container",
            marginY:"large",
          }}
          key={i.id}>
            <Inline></Inline>
            <Select 
            name='product'
            label='Select a product & price'
            aria-label="select product and price"
            onChange={(e) => {
              const price = e.target.value;
              setItems(currentItem => 
                produce(currentItem, v => {
                  v[index].price = price;
                })
              );
            }} value={i.price}>
              {prices?.map((price) => (
                <option
                key={price.id}
                value={price.id}
                id={price.id}>{`${price.product?.name} - ${price?.nickname} - ${("$"+ price?.unit_amount/100)}`}</option>
              ))}
            </Select>
            <Box
        css={{
          paddingY:'small',
          stack:'x',
        }}>      
          <Box css={{width:'1/2', paddingRight:'xsmall'}}>
           <Select
           onChange={(e) => {
            const discount = e.target.value;
            setItems(currentItem => 
              produce(currentItem, v => {
                v[index].coupon = discount;
              })
            );
          }}
            name="discount"
            label="Select a discount to apply"
          >
            {coupons?.map((discount) => (
              <option
              key={discount.id}
              value={discount.id}
              id={discount.id}>{discount.name}</option>
            ))}
          </Select>
          </Box>
          <Box css={{width:'1/2', paddingLeft:'xsmall'}}>
          <Select
            name="cycle"
            label="Number of iterations"
            onChange={(e) => {
              const iteration = e.target.value;
              setItems(currentItem => 
                produce(currentItem, v => {
                  v[index].iterations = iteration;
                })
              );
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="ongoing">Ongoing</option>
          </Select>
          </Box>
          
      </Box>
   
          </Box>
          
        )})}
  
        <Box
        css={{
          paddingTop:'large',
          paddingBottom:'large',
        }}>
          <Button
          type="primary"
          onClick={() => {
            setItems(currentItem => [...currentItem, {
              id:generate(),
            }])
          }}
          css={{
            width: 'fill',
            alignX: 'center'
          }}
          >Add Phase</Button>
        </Box>
        <Box>{JSON.stringify(items)}</Box>
      </FocusView>
    </ContextView>
  );
};

export default CustomerDetailView;
//not_started, active, completed, released, and canceled