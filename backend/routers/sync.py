from fastapi import APIRouter, HTTPException, Query
from models.process import Process
from models.resource import Resource
from models.action import Action
from utils.file_loader import load_processes_from_file, load_resources_from_file, load_actions_from_file
from fastapi import UploadFile, File
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