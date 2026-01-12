
export const ROLES = ["Customer", "Admin", "DeliveryPartner"];
export const ORDER_STATUS = ["available", "confirmed", "delivered", "cancelled", "arriving"]

export const sendSuccess = (res, code, message, data) => {
    return res.status(code).send({
        status: true,
        message,
        data,
    });
};

export const sendError = (res, code, message, error) => {
    return res.status(code).send({
        status: false,
        message,
        error,
    });
};
