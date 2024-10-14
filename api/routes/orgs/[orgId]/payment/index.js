import { getBillingConfig } from "../../../../util/billingConfig.js";
import { prisma } from "../../../../util/prisma.js";
import { requireAuth } from "../../../../util/requireAuth.js";
import { stripe } from "../../../../util/stripe.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;

    const org = await prisma.organization.findFirst({
      where: {
        id: req.params.orgId,
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        billingConfig: true,
      },
    });

    if (!org) {
      return res.status(404).json({
        error: "Organization not found",
      });
    }

    const billingConfig = await getBillingConfig(org.id);

    let customer;
    if (!org.billingConfig.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: org.privateContactEmail || req.user.email,
        metadata: {
          orgId: org.id,
        },
      });

      await prisma.organization.update({
        where: {
          id: org.id,
        },
        data: {
          billingConfig: {
            update: {
              stripeCustomerId: customer.id,
            },
          },
        },
      });

      await prisma.log.create({
        data: {
          organizationId: org.id,
          userId,
          type: "STRIPE_CUSTOMER_CREATED",
          data: {
            stripeCustomerId: customer.id,
          },
        },
      });
    } else {
      customer = await stripe.customers.retrieve(
        org.billingConfig.stripeCustomerId
      );
    }

    let subscription = null;
    if (customer && org.billingConfig.stripeSubscriptionId) {
      subscription = await stripe.subscriptions.retrieve(
        org.billingConfig.stripeSubscriptionId
      );
    }

    let paymentInfo = {
      requiresPaymentMethod: true,
      paymentMethod: null,
      portalLink: null,
    };

    if (customer.invoice_settings.default_payment_method) {
      paymentInfo.requiresPaymentMethod = false;
      const pm = await stripe.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method
      );
      paymentInfo.paymentMethod = {
        brand: pm.card.brand,
        last4: pm.card.last4,
      };
    }

    paymentInfo.portalLink = (
      await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${process.env.BASE_URL}/dashboard/organizations/${org.id}/billing`,
      })
    ).url;

    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 6,
    });

    res.json({
      paymentInfo,
      invoices: invoices.data,
      // customer,
      // subscription,
      billingConfig,
    });
  },
];
