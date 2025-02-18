package com.koushik.fomo.fomocalculatorbackend.exception;

public class InvestmentCalculationException extends RuntimeException {
    public InvestmentCalculationException(String message) {
        super(message);
    }

    public InvestmentCalculationException(String message, Throwable cause) {
        super(message, cause);
    }
}
