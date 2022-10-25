/*
phases: [
    {
      items: [
        {price: panels[3].data[4].id, quantity: 1}
        ],
      iterations: 1,
      coupon: 'hnW2nhoQ',
    },
    {
      items: [
        {price: panels[3].data[4].id, quantity: 1}
        ],
      iterations: 3,
      coupon:'f4T3p0Uu',
    },
  ],
*/ 


<FocusView
      title="Create new subscription schedule"
      shown={showDataInput}
      onClose={() => setShowDataInput(false)}
      primaryAction={<Button type='primary' >Save</Button>}
      secondaryAction={<Button onPress={() => setShowDataInput(false)}>Cancel</Button>}
      >
       
    <Box
    css={{
      paddingY:'small'
    }}>
        

      <Select
            name='product'
            label='Select a product & price'
            aria-label="select product and price"
            onChange={(e) => {console.log(e)}}
            >
              {prices?.map((price) => (
                <option
                key={price.id}
                value={price.id}
                id={price.id}>{`${price.product?.name} - ${price?.nickname} - ${("$"+ price?.unit_amount/100)}`}</option>
              ))}
            </Select>
       </Box>
             
       <Box
        css={{
          paddingY:'small',
          stack:'x',
        }}>      
          <Box css={{width:'1/2', paddingRight:'xsmall'}}>
           <Select
            name="discount"
            label="Select a discount to apply"
            onChange={(e) => {console.log(e)}}
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
            label="Billing cycle number"
            onChange={(e) => {console.log(e)}}
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
        <Box
        css={{
          paddingTop:'large',
          paddingBottom:'large',
        }}>
          <Button
          type="primary"
          css={{
            width: 'fill',
            alignX: 'center'
          }}>Add</Button>
        </Box>
        

        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Product</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Discount</TableHeaderCell>
              <TableHeaderCell>Cycle #</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
           

          </TableBody>
        </Table> 
      </FocusView>