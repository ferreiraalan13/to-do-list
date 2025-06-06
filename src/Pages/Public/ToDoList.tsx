import {
  Box,
  Button,
  Flex,
  Input,
  List,
  ListItem,
  Text,
  Checkbox,
  IconButton,
  useToast,
  Divider,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline, IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { PiCheckCircleDuotone } from "react-icons/pi";

type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const toast = useToast();

  const [isMobile] = useMediaQuery("(max-width: 1024px)");

  // Carregar tarefas do localStorage

  //KARIS
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON?.parse(stored));
    }
  }, []);

  // Salvar tarefas no localStorage sempre que alterarem
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /*
    adicionarTarefa
    Adiciona uma nova tarefa na lista.
    Verifica se o campo da nova tarefa (newTask) não está vazio.
    Cria um objeto de tarefa (task) com título, ID, status de completado falso e datas de criação e atualização.
    Adiciona essa tarefa à lista de tarefas (setTasks).
    Limpa o campo de input (setNewTask("")).
    Mostra um aviso (toast) de sucesso.
  */

  //JULIANO
  const adicionarTarefa = () => {
    if (!newTask.trim()) return;

    const now = new Date().toISOString();

    const task: Task = {
      id: Math.random().toString(),
      title: newTask,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [...prev, task]);
    setNewTask("");
    toast({ title: "Tarefa criada!", status: "success", duration: 1500 });
  };

  /*
  deletarTarefa
  Remove uma tarefa da lista com base no id.
  Filtra a lista de tarefas, removendo aquela com o ID informado.
  Atualiza a lista.
  Mostra um toast dizendo que a tarefa foi excluída.
 */

  //LEONARDO
  const deletarTarefa = (id: string) => {
    setTasks((prev) => prev?.filter((task) => task.id !== id));
    toast({ title: "Tarefa excluída!", status: "info", duration: 1500 });
  };

  /*
  completarTarefa
  Marca uma tarefa como completa ou incompleta (toggle).
  Percorre as tarefas.
  Se o ID bater, ela:
  Inverte o valor de isCompleted.
  Atualiza a data de modificação (updatedAt).
  Se a tarefa for marcada como concluída, adiciona a data de conclusão (completedAt); se desmarcar, essa data é removida.
  Atualiza a lista com essas mudanças.
*/

  const completarTarefa = (id: string) => {
    setTasks((prev) =>
      prev?.map((task) =>
        task.id === id
          ? {
              ...task,
              isCompleted: !task.isCompleted,
              updatedAt: new Date().toISOString(),
              completedAt: !task.isCompleted
                ? new Date().toISOString()
                : undefined,
            }
          : task
      )
    );
  };

  /*
editarTarefa (Prepara uma tarefa para ser editada.)
Passo a passo:
Procura a tarefa pelo ID.
Se encontrar, salva o ID da tarefa em edição (setEditingTaskId) e o texto atual dela (setEditingText) para editar depois. */

  const editarTarefa = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTaskId(id);
      setEditingText(task.title);
    }
  };

  /* handleSaveEdit Salva a edição de uma tarefa.
Verifica se o novo texto (editingText) não está vazio.
Atualiza o título da tarefa com o novo texto.
Atualiza a data de modificação (updatedAt).
Limpa os estados de edição (editingTaskId e editingText).
*/
  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;

    setTasks((prev) =>
      prev?.map((task) =>
        task.id === id
          ? { ...task, title: editingText, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  return (
    <Flex h="100dvh" justify="center">
      <Flex direction="column" justify="center" align="center" p={5} gap={4}>
        <Flex gap={2} width="100%" maxW="500px">
          <Input
            placeholder="Digite uma tarefa"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
          />
          <Button colorScheme="teal" onClick={adicionarTarefa}>
            Adicionar
          </Button>
        </Flex>
        {tasks.length > 0 && (
          <Flex gap={2} width="100%" maxW="500px">
            <Text>
              Feitas: {tasks.filter((task) => task.isCompleted).length} |
            </Text>
            <Text
              color="red"
              cursor="pointer"
              onClick={() => {
                setTasks([]);
              }}
            >
              Limpar todas as tarefas
            </Text>
          </Flex>
        )}

        <Flex
          position="relative"
          justify="center"
          maxH={"80dvh"}
          align="center"
        >
          {/* Espiral */}
          {!isMobile && (
            <Flex
              maxH={"80dvh"}
              direction="column"
              justify="space-evenly"
              height="100%"
              position="absolute"
              left="-20px"
              top="0"
              bottom="0"
              zIndex="3"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <Box
                  key={i}
                  width="12px"
                  height="12px"
                  bg="gray.700"
                  borderRadius="full"
                  boxShadow="md"
                />
              ))}
            </Flex>
          )}

          {/* Caderno */}
          <Box
            maxH={"80dvh"}
            minH={"80dvh"}
            overflow="auto"
            width="400px"
            maxW={isMobile ? "300px" : "600px"}
            borderWidth={4}
            borderColor="gray.600"
            borderRadius="lg"
            bg="white"
            p={5}
            position="relative"
            boxShadow="lg"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: "50px",
              width: "2px",
              height: "100%",
              bg: isMobile ? "none" : "red.400", // Linha da margem do caderno
              zIndex: 1,
            }}
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundImage:
              //   "repeating-linear-gradient(to bottom, transparent, transparent 29px, #cbd5e0 30px)", // linhas horizontais
              opacity: 0.4,
              zIndex: 0,
            }}
          >
            <Text textAlign="center" fontSize="2xl" mb={4} fontWeight="bold">
              Minhas tarefas
            </Text>

            {tasks.length > 0 ? (
              <List spacing={3} position="relative" zIndex={2}>
                {tasks?.map((task) => (
                  <Box key={task.id}>
                    <ListItem
                      key={`${task.id}-${Math.random()}`}
                      pl={isMobile ? "0px" : "60px"}
                    >
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={3}>
                          <Checkbox
                            isChecked={task.isCompleted}
                            onChange={() => completarTarefa(task.id)}
                          />

                          {editingTaskId === task.id ? (
                            <Input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSaveEdit(task.id)
                              }
                              size="sm"
                            />
                          ) : (
                            <>
                              <Box>
                                <Text
                                  as={task.isCompleted ? "s" : undefined}
                                  fontWeight="medium"
                                >
                                  {task.title}
                                </Text>
                                <Text mr={1} fontSize="xs" color="gray.500">
                                  Criado:{" "}
                                  {new Date(task.createdAt).toLocaleString()}
                                </Text>
                                {task.completedAt && (
                                  <Text fontSize="xs" color="green.600">
                                    Concluído:{" "}
                                    {new Date(
                                      task.completedAt
                                    ).toLocaleString()}
                                  </Text>
                                )}
                              </Box>
                            </>
                          )}
                        </Flex>

                        <Flex gap={2}>
                          {editingTaskId === task.id ? (
                            <>
                              <IconButton
                                size="sm"
                                aria-label="Salvar"
                                icon={<PiCheckCircleDuotone />}
                                onClick={() => handleSaveEdit(task.id)}
                                colorScheme="green"
                              />
                              <IconButton
                                size="sm"
                                aria-label="Cancelar"
                                icon={<IoCloseCircleOutline />}
                                onClick={() => setEditingTaskId(null)}
                                colorScheme="gray"
                              />
                            </>
                          ) : (
                            <>
                              <IconButton
                                size="sm"
                                aria-label="Editar"
                                icon={<MdEdit />}
                                onClick={() => editarTarefa(task.id)}
                                colorScheme="blue"
                              />
                              <IconButton
                                size="sm"
                                aria-label="Deletar"
                                icon={<IoTrash />}
                                onClick={() => deletarTarefa(task.id)}
                                colorScheme="red"
                              />
                            </>
                          )}
                        </Flex>
                      </Flex>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            ) : (
              <Text textAlign="center">
                Você não possui tarefas cadastradas
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ToDoList;
