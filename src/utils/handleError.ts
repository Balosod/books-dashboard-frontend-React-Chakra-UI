import type { useToast } from "@chakra-ui/react";

export const handleError = (
  error: any,
  toast?: ReturnType<typeof useToast>
) => {
  // Check for NestJS ValidationPipe errors (array of messages)
  const validationMessage =
    error.graphQLErrors?.[0]?.extensions?.originalError?.message;

  //  Fallback to standard GraphQL error or default message
  const message = validationMessage || error.message || "Something went wrong";

  // Format if it's an array (common with Class-Validator)
  const finalMessage = Array.isArray(message) ? message.join(", ") : message;

  if (toast) {
    toast({
      title: "Error",
      description: finalMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } else {
    console.error("[API Error]:", finalMessage);
  }
};
