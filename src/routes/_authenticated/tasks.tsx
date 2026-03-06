import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2Icon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const toggleComplete = useMutation(api.tasks.toggleComplete);
  const removeTask = useMutation(api.tasks.remove);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <PlusIcon className="mr-1 h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {tasks === undefined ? (
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No tasks yet. Create one above to get started.
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task._id}>
              <CardContent className="flex items-center gap-3 py-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() =>
                    toggleComplete({ id: task._id as Id<"tasks"> })
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {task.description}
                    </p>
                  )}
                </div>
                <Badge variant={task.completed ? "secondary" : "outline"}>
                  {task.completed ? "Done" : "Pending"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeTask({ id: task._id as Id<"tasks"> })
                  }
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
