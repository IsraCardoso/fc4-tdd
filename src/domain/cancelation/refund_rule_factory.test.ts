import { RefundRuleFactory } from "./refund_rule_factory";
import { FullRefund } from "./full_refund";
import { PartialRefund } from "./partial_refund";
import { NoRefund } from "./no_refund";

describe("RefundRuleFactory", () => {
  describe("getRefundRule", () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
      const daysUntilCheckIn = 8;
      
      const result = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
      
      expect(result).toBeInstanceOf(FullRefund);
      expect(result.calculateRefund(1000)).toBe(1000); // 100% de reembolso
    });

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
      let result = RefundRuleFactory.getRefundRule(7);
      expect(result).toBeInstanceOf(PartialRefund);
      expect(result.calculateRefund(1000)).toBe(500); // 50% de reembolso
      
      result = RefundRuleFactory.getRefundRule(1);
      expect(result).toBeInstanceOf(PartialRefund);
      expect(result.calculateRefund(1000)).toBe(500); // 50% de reembolso
      
      result = RefundRuleFactory.getRefundRule(4);
      expect(result).toBeInstanceOf(PartialRefund);
      expect(result.calculateRefund(1000)).toBe(500); // 50% de reembolso
    });

    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
      let result = RefundRuleFactory.getRefundRule(0);
      expect(result).toBeInstanceOf(NoRefund);
      expect(result.calculateRefund(1000)).toBe(1000); // 0% de reembolso
      
      result = RefundRuleFactory.getRefundRule(-1);
      expect(result).toBeInstanceOf(NoRefund);
      expect(result.calculateRefund(1000)).toBe(1000); // 0% de reembolso
    });
  });
});
