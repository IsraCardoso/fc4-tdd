// Property related error messages
export const PROPERTY_ERRORS = {
  NAME_REQUIRED: 'O campo nome é obrigatório.',
  MAX_GUESTS_INVALID: 'O número máximo de hóspedes deve ser maior que zero.',
  BASE_PRICE_INVALID: 'O preço base por noite deve ser maior que zero.',
  MAX_GUESTS_EXCEEDED: (maxGuests: number) => 
    `Número máximo de hóspedes excedido. Máximo permitido: ${maxGuests}.`,
  NOT_FOUND: 'Propriedade não encontrada.'
} as const;

// Booking related error messages
export const BOOKING_ERRORS = {
  ID_REQUIRED: 'O ID da reserva é obrigatório.',
  GUEST_REQUIRED: 'O hóspede da reserva é obrigatório.',
  PROPERTY_AND_GUEST_REQUIRED: 'A propriedade e o hóspede são obrigatórios.',
  GUEST_COUNT_INVALID: 'O número de hóspedes deve ser maior que zero.',
  TOTAL_PRICE_INVALID: 'O preço total não pode ser negativo.',
  DATE_RANGE_INVALID: 'Período de datas inválido.',
  PROPERTY_UNAVAILABLE: 'A propriedade não está disponível para o período selecionado.',
  NOT_FOUND: 'Reserva não encontrada.',
  ALREADY_CANCELLED: 'A reserva já está cancelada.'
} as const;

// User related error messages
export const USER_ERRORS = {
  ID_REQUIRED: 'O ID do usuário é obrigatório.',
  NAME_REQUIRED: 'O nome do usuário é obrigatório.',
  EMAIL_REQUIRED: 'O email é obrigatório.',
  EMAIL_INVALID: 'Email inválido.',
  NOT_FOUND: 'Usuário não encontrado.'
} as const;

// Common error messages
export const COMMON_ERRORS = {
  INTERNAL_SERVER_ERROR: 'Erro interno do servidor.',
  VALIDATION_ERROR: 'Erro de validação.',
  UNAUTHORIZED: 'Não autorizado.',
  FORBIDDEN: 'Acesso negado.'
} as const;
