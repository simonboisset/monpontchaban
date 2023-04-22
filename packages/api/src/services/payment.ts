import { TRPCError } from '@trpc/server';

const stripeService: any = {};

type CreateCustomerParams = {
  email: string;
  card: Card;
  price: string;
};

export type Customer = {
  id: string;
  email: string;
};

const createCustomer = async ({ email, card, price }: CreateCustomerParams) => {
  const customer = await stripeService.customers.create({
    email,
  });

  await createPaymentMethod({ customerId: customer.id, card });

  await stripeService.subscriptions.create({
    customer: customer.id,
    items: [{ price, quantity: 1 }],
  });

  return customer.id;
};

const updateCustomer = async ({ customerId, email, price }: { customerId: string; email: string; price: string }) => {
  const customer = await stripeService.customers.update(customerId, {
    email,
  });

  const subscriptions = await stripeService.subscriptions.list({ customer: customerId });
  const [subscription, ...subscriptionsToDelete] = subscriptions.data;

  if (subscriptionsToDelete.length > 0) {
    for (const subscriptionToDelete of subscriptionsToDelete) {
      await stripeService.subscriptions.del(subscriptionToDelete.id);
    }
  }

  if (subscription) {
    await stripeService.subscriptions.update(subscription.id, {
      items: [{ id: subscription.id, price }],
    });
  } else {
    await stripeService.subscriptions.create({
      customer: customer.id,
      items: [{ price, quantity: 1 }],
    });
  }

  return customer.id;
};

const deleteCustomer = async ({ customerId }: { customerId: string }) => {
  const subscriptions = await stripeService.subscriptions.list({ customer: customerId });
  for (const subscription of subscriptions.data) {
    await stripeService.subscriptions.del(subscription.id);
  }

  const paymentMethods = await stripeService.paymentMethods.list({ customer: customerId });
  for (const paymentMethod of paymentMethods.data) {
    await stripeService.paymentMethods.detach(paymentMethod.id);
  }

  const customer = await stripeService.customers.del(customerId);
  return customer.id;
};

export type Card = { number: string; expMonth: number; expYear: number; cvc: string };

const createPaymentMethod = async ({ customerId, card }: { customerId: string; card: Card }) => {
  const paymentMethod = await stripeService.paymentMethods.create({
    type: 'card',
    card: {
      number: card.number,
      exp_month: card.expMonth,
      exp_year: card.expYear,
      cvc: card.cvc,
    },
  });

  await stripeService.paymentMethods.attach(paymentMethod.id, { customer: customerId });
  return paymentMethod.id;
};

const updateSubcriptionQuantity = async ({
  customerId,
  membersCount,
}: {
  customerId: string;
  membersCount: number;
}) => {
  const subscriptionToUpdate = await stripeService.subscriptions.list({ customer: customerId, limit: 1 });
  if (!subscriptionToUpdate.data[0]?.id || !subscriptionToUpdate.data[0]?.items.data[0]?.id) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Subscription not found' });
  }
  const subscription = await stripeService.subscriptions.update(subscriptionToUpdate.data[0].id, {
    items: [{ id: subscriptionToUpdate.data[0].items.data[0].id, quantity: membersCount }],
  });

  return subscription.id;
};

const hasSubscriptionActive = async ({ customerId }: { customerId: string }) => {
  const subscriptions = await stripeService.subscriptions.list({ customer: customerId, limit: 1 });
  return null;
};

const getSubscriptionPrice = async ({ customerId }: { customerId: string }) => {
  const subscriptions = await stripeService.subscriptions.list({ customer: customerId, limit: 1 });
  if (!subscriptions.data[0]?.items.data[0]?.price.id) {
    return 0;
  }
  const price = await stripeService.prices.retrieve(subscriptions.data[0].items.data[0].price.id);
  return price.unit_amount;
};

export const payment = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  createPaymentMethod,
  updateSubcriptionQuantity,
  hasSubscriptionActive,
  getSubscriptionPrice,
};
