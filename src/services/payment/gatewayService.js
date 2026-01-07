export class PaymentGateway {
    constructor(config) {
        this.config = config;
    }

    async initialize() {
        throw new Error('Method not implemented');
    }

    async createOrder(amount, currency, receipt) {
        throw new Error('Method not implemented');
    }

    async verifyPayment(paymentDetails) {
        throw new Error('Method not implemented');
    }

    async processRefund(paymentId, amount) {
        throw new Error('Method not implemented');
    }
}

export class RazorpayGateway extends PaymentGateway {
    async initialize() {
        console.log('Initializing Razorpay with key:', this.config.apiKey);
        return true;
    }

    async createOrder(amount, currency = 'INR', receipt) {
        // Mock Razorpay Order Creation
        return {
            id: `order_${Math.random().toString(36).substr(2, 9)}`,
            entity: 'order',
            amount: amount * 100, // Razorpay expects paise
            amount_paid: 0,
            amount_due: amount * 100,
            currency: currency,
            receipt: receipt,
            status: 'created',
            attempts: 0,
            created_at: Math.floor(Date.now() / 1000),
        };
    }

    async verifyPayment(details) {
        // Mock verification logic
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = details;
        return !!(razorpay_order_id && razorpay_payment_id && razorpay_signature);
    }
}

export class StripeGateway extends PaymentGateway {
    async initialize() {
        console.log('Initializing Stripe with key:', this.config.apiKey);
        return true;
    }

    async createOrder(amount, currency = 'inr', receipt) {
        // Mock Stripe PaymentIntent
        return {
            id: `pi_${Math.random().toString(36).substr(2, 24)}`,
            object: 'payment_intent',
            amount: amount * 100,
            currency: currency,
            status: 'requires_payment_method',
            client_secret: `pi_secret_${Math.random().toString(36).substr(2, 24)}`,
        };
    }
}

export class PayUGateway extends PaymentGateway {
    async createOrder(amount, currency, receipt) {
        return {
            txnid: `txnid_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount,
            productinfo: receipt,
            firstname: 'Customer',
            email: 'customer@example.com'
        };
    }
}

export class CashfreeGateway extends PaymentGateway {
    async createOrder(amount, currency, receipt) {
        return {
            cf_order_id: `cf_${Math.random().toString(36).substr(2, 9)}`,
            order_amount: amount,
            order_currency: currency,
            customer_details: {
                customer_id: 'cust_001',
                customer_email: 'customer@example.com',
                customer_phone: '9999999999'
            },
            order_meta: {
                return_url: 'https://example.com/return?order_id={order_id}'
            }
        };
    }
}

export class PaytmGateway extends PaymentGateway {
    async createOrder(amount, currency, receipt) {
        return {
            orderId: `paytm_${Math.random().toString(36).substr(2, 9)}`,
            txnAmount: {
                value: amount.toString(),
                currency: currency
            },
            userInfo: {
                custId: 'cust_001'
            }
        };
    }
}

export class GatewayFactory {
    static getGateway(gatewayId, config) {
        switch (gatewayId) {
            case '1': // Razorpay
                return new RazorpayGateway(config);
            case '2': // Stripe
                return new StripeGateway(config);
            case '3': // PayU
                return new PayUGateway(config);
            case '4': // Cashfree
                return new CashfreeGateway(config);
            case '5': // Paytm
                return new PaytmGateway(config);
            default:
                throw new Error(`Gateway ${gatewayId} not supported`);
        }
    }
}
