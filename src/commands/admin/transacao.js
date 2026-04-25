import mongoose from "mongoose";

const TransacaoSchema = new mongoose.Schema({
  cliente: String,
  valor: Number,
  metodo: String, // "M-Pesa" ou "e-Mola"
  transacaoId: String,
  comprovativo: String,
  status: { type: String, enum: ["pendente", "confirmado", "usado", "teste"], default: "pendente" },
  data: Date,
  qrCode: String
});

export default mongoose.model("Transacao", TransacaoSchema);