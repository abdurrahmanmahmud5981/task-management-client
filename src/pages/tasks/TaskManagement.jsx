import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  Button,
  Input,
  Textarea,
  Typography,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdCancel, MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const TaskManagement = () => {
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const getCategoryColor = (category) => {
    switch (category) {
      case "To-Do":
        return "info";
      case "In Progress":
        return "warning";
      case "Done":
        return "success";
      default:
        return "primary";
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    const tasksCopy = { ...tasks };
    const [removed] = tasksCopy[sourceCategory].splice(source.index, 1);
    removed.category = destCategory; // Update the task's category
    tasksCopy[destCategory].splice(destination.index, 0, removed);

    setTasks(tasksCopy);
  };

  const handleOpen = (task = null) => {
    setOpen(!open);
    setEditingTask(task);
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
    } else {
      reset();
    }
  };

  const onSubmit = (data) => {
    if (editingTask) {
      // Update existing task
      const updatedTasks = { ...tasks };
      const categoryTasks = updatedTasks[editingTask.category];
      const taskIndex = categoryTasks.findIndex((t) => t.id === editingTask.id);

      if (taskIndex !== -1) {
        categoryTasks[taskIndex] = {
          ...editingTask,
          title: data.title,
          description: data.description,
          updatedAt: new Date().toISOString(),
        };
      }

      setTasks(updatedTasks);
    } else {
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        timestamp: new Date().toISOString(),
        category: "To-Do",
      };

      setTasks((prev) => ({
        ...prev,
        "To-Do": [...prev["To-Do"], newTask],
      }));
    }

    handleOpen();
    reset();
  };

  const deleteTask = (categoryId, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((task) => task.id !== taskId),
    }));
  };

  return (
    <Dialog size="md" className="p-6">
      <div className="flex justify-between items-center mb-8">
        <Dialog.Trigger
          className="cursor-pointer  border-none px-4 text-white  flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          as={Button}
          title="Add New Task"
          // onClick={()=> setOpen(true)}
          // onClick={() => handleOpen()}
        >
          <FaPlus /> <span className="hidden sm:block">Add New Task</span>
        </Dialog.Trigger>
      </div>
      {/* task modal */}
      <div>
        <Dialog.Overlay className="fixed inset-0 bg-black/50">
          <Dialog.Content className="bg-white rounded-xl shadow-xl max-w-md mx-auto mt-20 p-6">
            <Dialog.DismissTrigger
              as={IconButton}
              size="sm"
              variant="ghost"
              isCircular
              color="secondary"
              className="absolute right-2 top-2 cursor-pointer"
            >
              <MdCancel className="h-5 w-5" />
            </Dialog.DismissTrigger>

            <Typography variant="h5" className="mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Typography className="mb-2 font-medium">Title</Typography>
                <Input
                  className="!text-gray-900"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: 50,
                      message: "Title must be less than 50 characters",
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  Description
                </Typography>
                <Textarea
                  // color="blue"
                  className="!text-gray-900"
                  {...register("description", {
                    maxLength: {
                      value: 200,
                      message: "Description must be less than 200 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Dialog.DismissTrigger
                  as={Button}
                  color="secondary"
                  className="cursor-pointer"
                >
                  Cancel
                </Dialog.DismissTrigger>

                <Button
                  type="submit"
                  className="cursor-pointer  border-none px-4 text-white  flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </div>
      {/* drag task  */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([category, categoryTasks]) => (
            <div key={category} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <Typography type="h6" className="text-gray-800">
                  {category}
                </Typography>

                <Chip
                  className="w-8 h-8 flex justify-center text-blue-400 font-bold text-lg ring"
                  size="sm"
                >
                  <Chip.Label>{categoryTasks.length}</Chip.Label>
                </Chip>
              </div>

              <Droppable droppableId={category}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] transition-colors rounded-lg p-2 ${
                      snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    {categoryTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white rounded-lg shadow p-4 mb-3 transition-all ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-200"
                                : ""
                            }`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <Typography
                                    variant="h6"
                                    className="text-gray-800"
                                  >
                                    {task.title}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    className="text-gray-600"
                                  >
                                    {task.description}
                                  </Typography>
                                </div>
                                <div className="flex gap-2">
                                  <Dialog.Trigger>
                                    <IconButton
                                      // variant="text"
                                      // color="blue"
                                      className="text-blue-500 cursor-pointer"
                                      size="sm"
                                      onClick={() => handleOpen(task)}
                                    >
                                      <MdEdit className="h-4 w-4" />
                                    </IconButton>
                                  </Dialog.Trigger>
                                  <IconButton
                                    // variant="text"
                                    // // color="red"
                                    className="text-red-500 cursor-pointer"
                                    size="sm"
                                    onClick={() =>
                                      deleteTask(category, task.id)
                                    }
                                  >
                                    <MdDelete className="h-4 w-4" />
                                  </IconButton>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Chip
                                  className={`${getCategoryColor(category)}`}
                                  size="sm"
                                >
                                  <Chip.Label>{category}</Chip.Label>
                                </Chip>

                                <Typography
                                  variant="small"
                                  className="text-gray-500"
                                >
                                  {new Date(
                                    task.timestamp
                                  ).toLocaleDateString()}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </Dialog>
  );
};

export default TaskManagement;
