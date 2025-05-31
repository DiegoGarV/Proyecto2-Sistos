from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from models.process import Process
from models.resource import Resource
from models.action import Action
from utils.file_loader import load_processes_from_file, load_resources_from_file, load_actions_from_file
from core.sync_mech.mutex_locks import simulate_mutex
from core.sync_mech.semaphore import simulate_semaphores
from typing import List
import tempfile

router = APIRouter()

stored_processes: List[Process] = [] # memoria para procesos
stored_resources: List[Resource] = [] # memoria para recursos
stored_actions: List[Action] = [] # memoria para acciones

@router.post("/simulation-b/upload-processes")
async def upload_processes(file: UploadFile = File(...)):
    # Guardar archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        processes = load_processes_from_file(tmp_path)
        global stored_processes
        stored_processes = processes
        return {
            "message": "Procesos cargados correctamente.",
            "processes": [vars(p) for p in processes]
        }
    except Exception as e:
        return {"error": str(e)}
    
@router.post("/simulation-b/upload-resources")
async def upload_resources(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        resources = load_resources_from_file(tmp_path)
        global stored_resources
        stored_resources = resources
        return {
            "message": "Recursos cargados correctamente.",
            "resources": [vars(r) for r in resources]
        }
    except Exception as e:
        return {"error": str(e)}


@router.post("/simulation-b/upload-actions")
async def upload_actions(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        actions = load_actions_from_file(tmp_path)
        global stored_actions
        stored_actions = actions
        return {
            "message": "Acciones cargadas correctamente.",
            "actions": [vars(a) for a in actions]
        }
    except Exception as e:
        return {"error": str(e)}
    
@router.post("/simulation-b/run-mutex")
async def run_mutex_simulation():
    if not stored_processes or not stored_resources or not stored_actions:
        raise HTTPException(status_code=400, detail="Faltan procesos, recursos o acciones cargadas.")

    # Usar la función de simulación de Mutex
    timeline = simulate_mutex(stored_processes, stored_resources, stored_actions)
    return {
        "message": "Simulación Mutex completada.",
        "timeline": timeline
    }

@router.post("/simulation-b/run-semaphore")
async def run_semaphore_simulation():
    if not stored_processes or not stored_resources or not stored_actions:
        raise HTTPException(status_code=400, detail="Faltan procesos, recursos o acciones cargadas.")

    # Usar la función de simulación de Semáforos
    timeline = simulate_semaphores(stored_processes, stored_resources, stored_actions)
    return {
        "message": "Simulación Semáforo completada.",
        "timeline": timeline
    }

@router.post("/simulation-b/clear-processes")
async def clear_processes():
    global stored_processes
    stored_processes.clear()
    return {"message": "Procesos eliminados correctamente."}

@router.post("/simulation-b/clear-resources")
async def clear_resources():
    global stored_resources
    stored_resources.clear()
    return {"message": "Recursos eliminados correctamente."}

@router.post("/simulation-b/clear-actions")
async def clear_actions():
    global stored_actions
    stored_actions.clear()
    return {"message": "Acciones eliminadas correctamente."}

@router.post("/simulation-b/clear-all")
async def clear_all():
    global stored_processes, stored_resources, stored_actions
    stored_processes.clear()
    stored_resources.clear()
    stored_actions.clear()
    return {"message": "Todos los datos (procesos, recursos y acciones) fueron eliminados correctamente."}