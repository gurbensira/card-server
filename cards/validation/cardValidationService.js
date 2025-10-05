import cardSchema, { cardUpdateSchema } from "./cardValidationSchema.js";

export const validateCard = (card) => {
    return cardSchema.validate(card);
};

export const validateCardUpdate = (card) => {
    return cardUpdateSchema.validate(card);
};
//משימה
//למנוע הכנסת כרטיס לא תקין למסד הנתונים
//יש להדפיס בקונסול את הסיבה לשגיאה