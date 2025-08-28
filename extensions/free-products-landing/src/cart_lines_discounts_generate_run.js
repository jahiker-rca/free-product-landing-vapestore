import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from '../generated/api';


/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  if (!input.cart.lines.length) {
    throw new Error('No cart lines found');
  }

  const hasProductDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Product,
  );

  if (!hasProductDiscountClass) {
    return {operations: []};
  }

  const maxCartLine = input.cart.lines.find((line) => line.attribute.key === '_freeSample');
  if (!maxCartLine) {
    throw new Error('No cart line with attribute _freeSample found');
  }

  const operations = [];

  if (hasProductDiscountClass) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: 'FREE SAMPLE PRODUCT',
            targets: [
              {
                cartLine: {
                  id: maxCartLine.id,
                  quantity: 1
                },
              },
            ],
            value: {
              percentage: {
                value: 100,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  return {
    operations,
  };
}