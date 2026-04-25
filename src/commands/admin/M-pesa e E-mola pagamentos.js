import { PREFIX } from "../../config.js";
import { errorLog } from "../../utils/logger.js";
import Transacao from "../../models/transacao.js"; // modelo mongoose para transações

export default {
  name: "pagar",
  description: "Registra pagamento via M-Pesa ou e-Mola usando comprovativo.",
  commands: [
    "pagar",
    "pagamento",
    "confirmar-pagamento",
    "m-pesa",
    "emola",
  ],
  usage: `${PREFIX}pagar [comprovativo]`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, args, sendSuccessReply, sendErrorReply }) => {
    try {
      const comprovativo = args.join(" ");
      if (!comprovativo) {
        return await sendErrorReply("Envie o comprovativo (texto do SMS) junto com o comando.");
      }

      // Regex para extrair ID e valor
      const idMatch = comprovativo.match(/(PP\d+|RN\d+|0X\d+)/i);
      const valorMatch = comprovativo.match(/(\d+(\.\d{1,2})?)\s?MT/i);

      if (!idMatch || !valorMatch) {
        return await sendErrorReply("Comprovativo inválido. Não consegui extrair ID ou valor.");
      }

      const transacaoId = idMatch[0];
      const valor = parseFloat(valorMatch[1]);

      // Nome do cliente (WhatsApp JID → número)
      const clienteNome = remoteJid.split("@")[0];
      const hora = new Date().toLocaleString("pt-MZ");

      // Salvar no banco
      const novaTransacao = new Transacao({
        cliente: clienteNome,
        valor,
        metodo: comprovativo.includes("M-Pesa") ? "M-Pesa" : "e-Mola",
        transacaoId,
        comprovativo,
        status: "pendente",
        data: new Date()
      });

      await novaTransacao.save();

      await sendSuccessReply(
        `✅ Pagamento registado!\n` +
        `Cliente: ${clienteNome}\n` +
        `Hora: ${hora}\n` +
        `ID: ${transacaoId}\n` +
        `Valor: ${valor} MT`
      );
    } catch (error) {
      errorLog(error);
      await sendErrorReply("Erro ao processar o comprovativo. Tente novamente.");
    }
  },
};