import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { Protein, ProteinModification } from '../types';
import { proteinModificationService } from '../services/proteinModificationService';
import { Menu, MenuItem } from '@mui/material';
import { authService } from '../services/authService';
import { ProteinModificationForm } from './ProteinModificationForm';

const NodeContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 2px solid #2196f3;
  min-width: 150px;
  cursor: pointer;
  position: relative;
  &:hover {
    box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  }
`;

const ProteinName = styled.div`
  font-weight: bold;
  color: #2196f3;
  text-align: center;
  margin-bottom: 5px;
`;

const ModificationContainer = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
`;

const ModificationBranch = styled.div<{ $angle: number }>`
  position: absolute;
  height: 2px;
  background-color: #90caf9;
  transform-origin: left center;
  transform: rotate(${props => props.$angle}deg);
  z-index: 1;
  pointer-events: none;
`;

const ModificationNode = styled.div<{ $angle: number; $type: string }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$type) {
      case 'Phosphorylation': return '#FF5722';
      case 'Methylation': return '#4CAF50';
      case 'Acetylation': return '#9C27B0';
      case 'Ubiquitination': return '#FFC107';
      case 'SUMOylation': return '#3F51B5';
      case 'Glycosylation': return '#795548';
      default: return '#607D8B';
    }
  }};
  cursor: pointer;
  transform: translate(-50%, -50%) rotate(${props => props.$angle}deg);
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
  z-index: 10;
  pointer-events: all;
`;

const ModificationHandleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  > * {
    pointer-events: all;
  }
`;

interface ProteinNodeProps {
  data: Protein;
}

const ProteinNode: React.FC<ProteinNodeProps> = ({ data }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [nodeSize, setNodeSize] = useState({ width: 0, height: 0 });
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [modifications, setModifications] = useState<ProteinModification[]>([]);
  const [showModificationForm, setShowModificationForm] = useState(false);
  const [selectedModification, setSelectedModification] = useState<ProteinModification | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.verifyToken();
      setIsAdmin(!!user);
    } catch (error) {
      setIsAdmin(false);
    }
  }, []);

  const loadModifications = useCallback(async () => {
    try {
      const mods = await proteinModificationService.getByProteinId(data._id);
      setModifications(mods);
    } catch (error) {
      console.error('Failed to load modifications:', error);
    }
  }, [data._id]);

  useLayoutEffect(() => {
    if (nodeRef.current) {
      setNodeSize({
        width: nodeRef.current.offsetWidth,
        height: nodeRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
    loadModifications();
  }, [checkAuth, loadModifications]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    // Only show context menu for admin users
    if (!isAdmin) return;
    
    // Only clear selectedModification if clicking on the node itself, not on a modification
    const target = event.target as HTMLElement;
    if (!target.closest('.modification-node')) {
      setSelectedModification(null);
    }
    
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleAddModification = (event?: React.MouseEvent) => {
    setSelectedModification(null);
    handleClose();
    
    // Remove focus from the clicked button immediately
    if (event?.currentTarget) {
      (event.currentTarget as HTMLElement).blur();
    }
    
    // Remove focus from the node BEFORE opening dialog
    // Use setTimeout to ensure this happens before React re-renders
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
      
      // Remove focus from all buttons (MenuItem buttons)
      const buttons = document.querySelectorAll('.MuiButtonBase-root, .MuiMenuItem-root');
      buttons.forEach(button => {
        (button as HTMLElement).blur();
      });
      
      // Remove focus from the node container
      if (nodeRef.current) {
        nodeRef.current.blur();
      }
      
      // Remove focus from all React Flow nodes
      const allNodes = document.querySelectorAll('.react-flow__node');
      allNodes.forEach(node => {
        (node as HTMLElement).blur();
        (node as HTMLElement).classList.remove('selected');
      });
      
      // Remove focus from handles
      const handles = document.querySelectorAll('.react-flow__handle');
      handles.forEach(handle => {
        (handle as HTMLElement).blur();
      });
      
      // Force focus to body
      document.body.focus();
      document.body.blur();
      
      // Now open the dialog after focus is removed
      setShowModificationForm(true);
    }, 0);
  };

  const handleModificationClick = (event: React.MouseEvent, mod: ProteinModification) => {
    event.stopPropagation();
    event.preventDefault();
    // Only allow modification management for admin users
    if (!isAdmin) {
      console.log('User is not admin, cannot manage modifications');
      return;
    }
    
    console.log('Modification clicked:', mod);
    setSelectedModification(mod);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleModificationSubmit = async (formData: Omit<ProteinModification, '_id' | 'proteinId' | 'createdAt' | 'updatedAt'>) => {
    console.log('handleModificationSubmit called with:', formData);
    console.log('selectedModification:', selectedModification);
    console.log('proteinId:', data._id);
    
    try {
      let result;
      if (selectedModification) {
        console.log('Updating modification:', selectedModification._id);
        result = await proteinModificationService.update(selectedModification._id, formData);
      } else {
        console.log('Creating new modification for protein:', data._id);
        result = await proteinModificationService.create(data._id, formData);
      }
      console.log('Modification saved successfully:', result);
      await loadModifications();
      setShowModificationForm(false);
      setSelectedModification(null);
    } catch (error: any) {
      console.error('Failed to save modification:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save modification';
      alert(`Error: ${errorMessage}`);
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleDeleteModification = async (mod: ProteinModification) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete the modification "${mod.type} at ${mod.position}"?`
    );
    if (!confirmed) {
      return;
    }

    try {
      console.log('Deleting modification:', mod._id);
      await proteinModificationService.delete(mod._id);
      console.log('Modification deleted successfully');
      await loadModifications();
      handleClose();
      setSelectedModification(null);
    } catch (error: any) {
      console.error('Failed to delete modification:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete modification';
      alert(`Error: ${errorMessage}`);
    }
  };

  // 计算修饰节点的位置
  const getModificationPosition = (index: number, totalMods: number) => {
    const baseAngle = -90; // 起始角度（正上方）
    const angleSpread = 180; // 分布的角度范围
    const angle = baseAngle + (angleSpread / (totalMods + 1)) * (index + 1);
    return angle;
  };

  return (
    <NodeContainer 
      ref={nodeRef} 
      onContextMenu={handleContextMenu}
      style={{ pointerEvents: 'auto' }}
    >
      <Handle type="target" position={Position.Top} />
      <ProteinName>{data.name}</ProteinName>

      <ModificationContainer>
        {nodeSize.width > 0 && modifications.map((mod, index) => {
          const angle = getModificationPosition(index, modifications.length);
          const radians = (angle * Math.PI) / 180;
          const w2 = nodeSize.width / 2;
          const h2 = nodeSize.height / 2;
          const cos_t = Math.cos(radians);
          const sin_t = Math.sin(radians);

          let r_intersect;
          if (w2 * Math.abs(sin_t) < h2 * Math.abs(cos_t)) {
            r_intersect = w2 / Math.abs(cos_t);
          } else {
            r_intersect = h2 / Math.abs(sin_t);
          }

          const startX = r_intersect * cos_t;
          const startY = r_intersect * sin_t;

          const branchLength = 25;
          const endX = (r_intersect + branchLength) * cos_t;
          const endY = (r_intersect + branchLength) * sin_t;

          return (
            <React.Fragment key={mod._id}>
              <ModificationBranch
                $angle={angle}
                style={{
                  left: `calc(50% + ${startX}px)`,
                  top: `calc(50% + ${startY}px)`,
                  width: `${branchLength}px`
                }}
              />
              <ModificationNode
                $angle={angle}
                $type={mod.type}
                className="modification-node"
                style={{
                  left: `calc(50% + ${endX}px)`,
                  top: `calc(50% + ${endY}px)`,
                }}
                onClick={(e) => handleModificationClick(e, mod)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleModificationClick(e, mod);
                }}
                title={`${mod.type} at ${mod.position}${isAdmin ? ' (Click to edit/delete)' : ''}`}
              />
              <ModificationHandleContainer
                style={{
                  left: `calc(50% + ${endX}px)`,
                  top: `calc(50% + ${endY}px)`,
                }}
              >
                {/* Source handles for outgoing connections */}
                <Handle
                  type="source"
                  position={Position.Top}
                  id={`${mod._id}-top`}
                  style={{ top: -6, left: 0 }}
                />
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${mod._id}-right`}
                  style={{ top: 0, left: 6 }}
                />
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id={`${mod._id}-bottom`}
                  style={{ top: 6, left: 0 }}
                />
                <Handle
                  type="source"
                  position={Position.Left}
                  id={`${mod._id}-left`}
                  style={{ top: 0, left: -6 }}
                />
                {/* Target handles for incoming connections */}
                <Handle
                  type="target"
                  position={Position.Top}
                  id={`${mod._id}-target-top`}
                  style={{ top: -6, left: 0 }}
                />
                <Handle
                  type="target"
                  position={Position.Right}
                  id={`${mod._id}-target-right`}
                  style={{ top: 0, left: 6 }}
                />
                <Handle
                  type="target"
                  position={Position.Bottom}
                  id={`${mod._id}-target-bottom`}
                  style={{ top: 6, left: 0 }}
                />
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${mod._id}-target-left`}
                  style={{ top: 0, left: -6 }}
                />
              </ModificationHandleContainer>
            </React.Fragment>
          );
        })}
      </ModificationContainer>

      <Handle type="source" position={Position.Bottom} />

      {isAdmin && (
        <Menu
          open={contextMenu !== null}
          onClose={() => {
            handleClose();
            setSelectedModification(null);
          }}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {selectedModification ? (
            <>
              <MenuItem 
                onClick={(e) => {
                  console.log('Edit clicked for modification:', selectedModification);
                  e.currentTarget.blur();
                  handleClose();
                  
                  // Remove focus before opening dialog
                  setTimeout(() => {
                    const activeElement = document.activeElement as HTMLElement;
                    if (activeElement) {
                      activeElement.blur();
                    }
                    
                    // Remove focus from all buttons
                    const buttons = document.querySelectorAll('.MuiButtonBase-root, .MuiMenuItem-root');
                    buttons.forEach(button => {
                      (button as HTMLElement).blur();
                    });
                    
                    if (nodeRef.current) {
                      nodeRef.current.blur();
                    }
                    
                    // Remove focus from all React Flow nodes
                    const allNodes = document.querySelectorAll('.react-flow__node');
                    allNodes.forEach(node => {
                      (node as HTMLElement).blur();
                      (node as HTMLElement).classList.remove('selected');
                    });
                    
                    // Remove focus from handles
                    const handles = document.querySelectorAll('.react-flow__handle');
                    handles.forEach(handle => {
                      (handle as HTMLElement).blur();
                    });
                    
                    // Force focus to body
                    document.body.focus();
                    document.body.blur();
                    
                    // Now open the dialog after focus is removed
                    setShowModificationForm(true);
                  }, 0);
                }}
                onMouseDown={(e) => {
                  // Prevent focus on mousedown
                  e.preventDefault();
                }}
              >
                Edit Modification
              </MenuItem>
              <MenuItem 
                onClick={(e) => {
                  console.log('Delete clicked for modification:', selectedModification);
                  e.currentTarget.blur();
                  handleDeleteModification(selectedModification);
                }}
                onMouseDown={(e) => {
                  // Prevent focus on mousedown
                  e.preventDefault();
                }}
                style={{ color: '#d32f2f' }}
              >
                Delete Modification
              </MenuItem>
            </>
          ) : (
            <MenuItem 
              onClick={(e) => {
                e.currentTarget.blur();
                handleAddModification(e);
              }}
              onMouseDown={(e) => {
                // Prevent focus on mousedown
                e.preventDefault();
              }}
            >
              Add Modification
            </MenuItem>
          )}
        </Menu>
      )}

      <ProteinModificationForm
        open={showModificationForm}
        onClose={() => setShowModificationForm(false)}
        onSubmit={handleModificationSubmit}
        initialData={selectedModification || {}}
      />
    </NodeContainer>
  );
};

export default ProteinNode; 